const pageDataPath = 'pagedata.json'
const getTemplatePath = (template) => `templates/${template}.html`;
const debug = true;

function fetchPageData() {
    return fetch(pageDataPath)
    .then(response=>response.json())
    .catch(error=>doError(error));
}

function fetchTemplate(template) {
    return fetch(template)
    .then(response => response.text())
    .catch(error=>doError(error));
}
function fetchHTML(template) {
    const templatePath = getTemplatePath(template);
    return fetch(templatePath)
    .then(response => response.text())
    .catch(error=>doError(error));

}
function doError(error) {
    if(debug) {
    const errorContainer = document.createElement('div');
    errorContainer.style.backgroundColor = '#f8d7da'; 
    errorContainer.style.color = '#721c24'; 
    errorContainer.style.padding = '10px';
    errorContainer.style.margin = '10px 0';
    errorContainer.style.border = '1px solid #f5c6cb';
    errorContainer.style.borderRadius = '5px';
    errorContainer.innerText = error;
    document.body.innerHTML = "";
    document.body.appendChild(errorContainer);
    console.error(error);
    } 
}
async function renderPage(page, pageData) {
    const templatePath = getTemplatePath(page);

    try {
        let template = await fetchTemplate(templatePath); 
        let rendered = template;
        let htmlPromises = [];

        const replacePlaceholders = (template, data) => {
            const simplePattern = /{{([a-zA-Z0-9_]+)}}/g;                           // {{title}}
            const keyPattern = /{{key:([a-zA-Z0-9_]+)}}/g;                          // {{key:title}}
            const valuePattern = /{{value:([a-zA-Z0-9_]+)}}/g;                      // {{value:title}}
            const urlPattern = /{{url:([a-zA-Z0-9_]+)}}/g;                          // {{url:page_title}}
            const propertyPattern = /{{([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)}}/g;        // {{obj.prop}}
            const fromPattern = /{{from:([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)*)}}/g;    // {{from:page.item}}

            template = template.replace(simplePattern, (match, key) => {
                return data[key] !== undefined ? data[key] : match;
            });
            template = template.replace(keyPattern, (match, p1) => p1);
            template = template.replace(valuePattern, (match, p1) => data[p1]);
            template = template.replace(urlPattern, (match, p1) => `#${p1}`);
            template = template.replace(propertyPattern, (match, objKey, propKey) => {
                return data[objKey] && data[objKey][propKey] ? data[objKey][propKey] : match;
            });

            template = template.replace(fromPattern, (match, keys) => {
                const keyParts = keys.split('.');
                let value = pageData;

                for (let part of keyParts) {
                    if (value[part] !== undefined) {
                        value = value[part];
                    } else {
                        return match; 
                    }
                }
                return value;
            });

            return template;
        };

        rendered = rendered.replace(/{{html:([a-zA-Z0-9_]+)}}/g, (match, p1) => {   //{{html:file}}
            htmlPromises.push(
                fetchHTML(p1).then(htmlContent => {
                    rendered = rendered.replace(match, htmlContent);
                    rendered = replacePlaceholders(rendered, pageData[page]);
                })
            );
            return match;
        });

        await Promise.all(htmlPromises);

        rendered = replacePlaceholders(rendered, pageData[page]);

        const headContent = rendered.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        const bodyContent = rendered.match(/<body[^>]*>([\s\S]*?)<\/body>/i);

        if (headContent) {
            document.head.innerHTML = headContent[1];
        }
        if (bodyContent) {
            document.body.innerHTML = bodyContent[1];
        } 
        
    } catch (error) {
        doError(error)
    }
}

function handlePageChange() {
    fetchPageData().then(pageData => {
        const currentPage = window.location.hash.slice(1) || 'home';
        renderPage(currentPage, pageData);
        window.scrollTo(0, 0);
    });
}

window.addEventListener("hashchange", handlePageChange);

handlePageChange();