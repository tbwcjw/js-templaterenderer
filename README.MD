# js-templaterenderer

Simple JS based single-page application renderer. Dynamically loads contents and templates based on URL hash changes. Content management using JSON and HTML templates.

#### Things to note

1. This is early development. I have a lot of ideas for this, but it will take time. I suck at updating readme's and I'm bad at explaining things. If you want to help, submit a pull request.
2. This was not designed for managing, storing or retrieving user data. Storing private data in a JSON would be bad don't do that.

#### Syntax
| Syntax | Regex | Description |
| ------ | ----- | ----------- |
| ```{{key}}``` | ```/{{([a-zA-Z0-9_]+)}}/g``` | Returns value of the key ```key```
| ```{{key:item}}``` | ```/{{key:([a-zA-Z0-9_]+)}}/g``` | Returns the key of item ```item```
| ```{{value:item}}``` | ```/{{value:([a-zA-Z0-9_]+)}}/g``` | Returns the value of item ```item``` |
| ```{{url:page}}``` | ```/{{url:([a-zA-Z0-9_]+)}}/g``` | Useful for ```<a href>```. Redirects to ```page``` from templates.
| ```{{item.subitem}}``` | ```/{{([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)}}/g``` | Nested JSON items. Returns the ```subitem``` value from ```item```
| ```{{from:page.item}}```|  ```/{{from:([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)}}/g``` | Useful for returning items from other pages. 
| ```{{html:page}}``` | ```/{{html:([a-zA-Z0-9_]+)}}/g``` | Renders HTML from other pages to the current page. Useful for rendering static elements i.e. headers onto multiple template files.

#### Expansion and Development

It should be pretty simple to include your own placeholder regexes. Just add the logic into `replacePlaceholders`. Open a pull request and I'll merge your changes in.

### Get Started

##### Installation:

From Clone: ``` git clone https://github.com/tbwcjw/js-templaterenderer.git ```

From Template: This repository can be [used as a template](https://github.com/new?template_name=js-templaterenderer).

##### Sample Directory Structure:
```
/project-root
├── /src                #js-template-renderer src
│   └── app.js           
│
├── /templates          #page templates
│   ├── home.html       
│   ├── about.html       
│   └── contact.html 
│    
├── pagedata.json        #page data
└── index.html          #entry
```
##### Local development:

For local development, due to CORS, use pythons built in http server.
```python -m http.server 8000```

Edit the top four lines of ```app.js```:

1. ```const pageDataPath = 'pagedata.json'```
Replace 'pagedata.json' with the path to your page data JSON file.

2. ```const getTemplatePath = (template) => `templates/${template}.html`;```
Replace 'templates/' with the path to your HTML template files

3. ```const debug = true;```
By default, debug is on. Errors will be logged to console, and appear in the document innerHTML. Do not keep this on in production.

4. ```const homeTemplate = 'home';```
The name of the template used on your landing page. Ensure this page exists in ```templates/```.

### Quirks Mode
To avoid Quirks Mode. Add a ```DOCTYPE``` and ```head``` opening tag in ```index.html``` (project root).
```
<!DOCTYPE html>
<head>
<script src="src/app.js"></script>
```
All other ```<head>``` elements in the appropriate template files will be retrieved appropriately.
### Examples
Below are some webpages using js-templaterenderer:

1. [LeachUK](https://tbwcjw.github.io/LeachUKsite/) - A simple linktree-alike. [repo](https://github.com/tbwcjw/LeachUKsite)

### Contributing
Contributions are welcome. Submit a pull request or open an issue for any bugs or feature issues.

### License
This project is licensed under the MIT License.
