from pathlib import Path
from html.parser import HTMLParser
import re,json,gzip,subprocess
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.refs=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  for k in ['src','href']:
   x=a.get(k,'')
   if x and not x.startswith(('https:','http:','#','data:','blob:')):self.refs.append(x.split('?')[0])
p=Page();html=Path('index.html').read_text();p.feed(html);assert len(p.ids)==len(set(p.ids))
for ref in p.refs:assert Path(ref).is_file(),ref
for f in Path('js').glob('*.js'):
 subprocess.run(['node','--check',str(f)],check=True)
 for ref in re.findall(r"(?:from |import\()'([^']+)'",f.read_text()):assert(f.parent/ref).is_file(),ref
 assert 'innerHTML' not in f.read_text(),f
logic=Path('js/diagnosis.js').read_text();assert 'Math.random' not in logic and 'Date.' not in logic
assert re.search(r'<div id="resultAd" hidden ',html);assert html.count('https://asobeatapps-ops.github.io/gamehome/')==1
assert not re.search(r'<script[^>]+src="https?://',html)
assert Path('assets/images/ogp.png').read_bytes()[16:24]==(1200).to_bytes(4,'big')+(630).to_bytes(4,'big')
paths=[Path('index.html'),Path('style.css'),*Path('js').glob('*.js'),*Path('vendor').glob('*.js'),Path('assets/icons/favicon.svg')];size=sum(len(gzip.compress(f.read_bytes())) for f in paths);assert size<2*1024*1024
print('PASS HTML IDs/references, module graph/syntax, no unsafe HTML/name randomness, hidden ad slot, one home link, no external scripts, OGP dimensions')
print('Initial resource gzip bytes:',size)
Path('reports/size.json').write_text(json.dumps({'initialRawBytes':sum(f.stat().st_size for f in paths),'initialGzipBytes':size,'ogpBytes':Path('assets/images/ogp.png').stat().st_size,'note':'OGP is metadata and is not fetched by ordinary page load. Gzip estimate is per file, not an on-wire measurement.'},indent=2))
