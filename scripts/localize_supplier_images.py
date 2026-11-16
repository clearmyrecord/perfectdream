#!/usr/bin/env python3
"""Cache supplier-public product photography in our own GitHub Pages asset folder."""
from pathlib import Path
from urllib.request import Request, urlopen
from PIL import Image
from io import BytesIO
import shutil
SOURCES = {
  "mirror-house": "https://image.made-in-china.com/2f0j00gaHkdZJCZDzY/Factory-Direct-Supply-of-Modern-Luxury-Prefabricated-Modular-Easy-Assembly-20FT-40FT-Character-Glass-Mirror-Container-Houses-Portable-Modular-Hotel-Home-Cabin.webp",
  "pool": "https://image.made-in-china.com/2f0j00kzMfLtOJZRbs/High-Quality-Chinese-Factory-Outlet-Modular-Prefabricated-Shipping-Container-Swimming-Pool.webp",
  "apple-cabin": "https://19589575.s21i.faiusr.com/2/ABUIABACGAAg99zeogYonde-6wUwoAY4oAY.jpg",
  "studio": "https://19589575.s21i.faiusr.com/2/ABUIABACGAAgh77y7wUozoreCzC-GjijEw.jpg",
  "glamping": "https://19589575.s21i.faiusr.com/2/ABUIABACGAAgj7P27wUopa3DkAMwoAs4uAg.jpg",
  "cafe": "https://19589575.s21i.faiusr.com/2/ABUIABACGAAgrNLy7wUo_buIgAYw2hw4kRM.jpg",
  "restroom": "https://image.made-in-china.com/2f0j00pyOkNAVJQcrE/Prefab-Modular-Portable-Mobile-Container-Toilets-for-Camping.webp",
  "restroom-inside": "https://image.made-in-china.com/2f0j00mhwfLVdsQaoJ/Portable-Mobile-Restroom-Bathroom-with-Water-Tank-and-Waste-Tank-for-Festival.jpg",
  "mirror-resort": "https://image.made-in-china.com/365f3j00VCYlTPEajSpQ/Factory-Direct-Supply-of-Modern-Luxury-Prefabricated-Modular-Easy-Assembly-20FT-40FT-Character-Glass-Mirror-Container-Houses-Portable-Modular-Hotel-Home-Cabin.webp",
  "pool-night": "https://image.made-in-china.com/2f0j00uhngPAbrEOqz/Mobile-Prefab-Container-Swimming-Pool-for-Sale-Ready-Made-Modern-Container-Pool-Swimming.webp",
  "modular-home": "https://19589575.s21i.faiusr.com/2/ABUIABACGAAgh77y7wUozoreCzC-GjijEw.jpg"
}
OUT=Path('assets/photos')
OUT.mkdir(exist_ok=True,parents=True)
ok=[]
for name,url in SOURCES.items():
    try:
        req=Request(url,headers={'User-Agent':'Mozilla/5.0 (compatible; PerfectDreamModular/1.0)','Accept':'image/webp,image/*;q=0.9,*/*;q=0.7'})
        with urlopen(req,timeout=40) as res: data=res.read(7000000)
        im=Image.open(BytesIO(data)).convert('RGB')
        if im.width<250 or im.height<170:raise ValueError('Image too small')
        im.thumbnail((1440,1050),Image.Resampling.LANCZOS)
        dest=OUT/(name+'.jpg')
        im.save(dest,'JPEG',quality=82,optimize=True,progressive=True)
        ok.append(name);print('OK',name,im.size,dest.stat().st_size)
    except Exception as e:print('UNAVAILABLE',name,type(e).__name__,str(e))
if len(ok)<4:
    raise SystemExit('Too few source photographs verified; asset publication aborted')
for name in SOURCES:
    target=OUT/(name+'.jpg')
    if not target.exists():
        # Ensure that the public website never renders a broken image.
        fallback='pool' if 'pool' in name else 'mirror-house'
        if not (OUT/(fallback+'.jpg')).exists():fallback=ok[0]
        shutil.copyfile(OUT/(fallback+'.jpg'),target)
        print('FALLBACK',name,fallback)
print('Verified generated asset count:',len(list(OUT.glob('*.jpg'))))
