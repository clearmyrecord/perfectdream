// Build-time only: retrieve exact public templates and package the pinned PDF library.
import {mkdir,copyFile,writeFile,readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const lib=require('pdf-lib');const {PDFDocument}=lib;
const mapCode=await readFile('permit-forms-map.js','utf8');new Function(mapCode)();const map=globalThis.PermitFormMap;
const dir='permit-forms-dist';
await mkdir(dir,{recursive:true});
const sources={
cityResidential:'https://files.lasvegasnevada.gov/building-safety/Forms/Residential/Residential-Building-Application.pdf',
cityCommercial:'https://files.lasvegasnevada.gov/building-safety/Forms/Commercial/Commercial-Building-Application.pdf',
county:'https://www.clarkcountynv.gov/assets/documents/government/departments/building___fire_prevention/plan_submittal/application-forms/building-permit-application-form-bpa-002-11-27-2023.pdf'};
const manifest={version:'5.0-preview',forms:{}};
for(const [id,url] of Object.entries(sources)){try{
const response=await fetch(url,{signal:AbortSignal.timeout(25000),redirect:'follow'});
if(!response.ok||!['files.lasvegasnevada.gov','www.clarkcountynv.gov'].includes(new URL(response.url).hostname))throw Error('Source unavailable');
const bytes=Buffer.from(await response.arrayBuffer());
if(bytes.length>8*1024*1024||bytes.subarray(0,5).toString()!=='%PDF-')throw Error('Not a bounded PDF');
const doc=await PDFDocument.load(bytes);const page=doc.getPages()[0];const {width,height}=page.getSize();
if(doc.getPageCount()!==1||Math.abs(width/height-1088/1408)>.012||page.getRotation().angle!==0)throw Error('Unexpected form geometry');
const sha256=createHash('sha256').update(bytes).digest('hex');
const sample=await map.generate(lib,bytes,id,{project:'SYNTHETIC QA SAMPLE',address:'TEST SITE - NOT A REAL ADDRESS',category:id==='cityCommercial'?'commercial':'residential',buildings:'1',scope:'Example modular building',valuation:'123456',occupancy:'TEST',construction:'TEST',area:'320',units:'1',stories:'1',buildingUse:'Example only',contractor:'SAMPLE CONTRACTOR',applicant:'TEST APPLICANT',owner:'TEST OWNER',parcel:'000-00-000-000',sewer:'sewer'});const check=await PDFDocument.load(sample.bytes);if(check.getPageCount()!==1||sample.filled.length<8)throw Error('Synthetic mapping check failed');await writeFile(dir+'/'+id+'.pdf',bytes);await writeFile(dir+'/qa-'+id+'.pdf',sample.bytes);manifest.forms[id]={url,sha256,width,height,available:true,sample:true,qaFields:sample.filled.length};console.log('FORM QA '+id+' mapped '+sample.filled.length+' fields; render inspection still required');console.log('FORM '+id+' '+sha256+' '+width+'x'+height);
}catch(e){manifest.forms[id]={url,available:false};console.log('FORM UNAVAILABLE '+id+' '+String(e.message).slice(0,150))}}
const browserLib=require.resolve('pdf-lib/dist/pdf-lib.min.js');await copyFile(browserLib,dir+'/pdf-lib.min.js');
await copyFile('permit-forms.html',dir+'/index.html');await copyFile('permit-forms-map.js',dir+'/permit-forms-map.js');
await writeFile(dir+'/manifest.json',JSON.stringify(manifest,null,2));
console.log('V5 assets built; available templates '+Object.values(manifest.forms).filter(x=>x.available).length);
