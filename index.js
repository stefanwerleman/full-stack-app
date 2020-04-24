const API_URL = "https://cfw-takehome.developers.workers.dev/api/variants";
const LINKEDIN_URL = "https://www.linkedin.com/in/stefanwerleman/";
const GITHUB_URL = "https://github.com/stefanwerleman";
const VARIANT_ONE_ENDPOINT = "/1";

class ElementHandler
{
   constructor (value)
   {
      this.value = value;
   }

   element (element)
   {
      element.setInnerContent(this.value, { html: true });
   }
}

class AttributeRewriter
{
   constructor (attributeName, url)
   {
      this.attributeName = attributeName;
      this.url = url
   }

   element (element)
   {
      var attribute = element.getAttribute(this.attributeName);

      if (attribute)
      {
         element.setAttribute(this.attributeName, this.url);
      }
   }
}

// Customization for Variant 1
async function customizeVariant1(response)
{
   const rewriter = new HTMLRewriter()
      .on("title", new ElementHandler("My GitHub"))
      .on("h1#title", new ElementHandler("My GitHub"))
      .on("p#description", new ElementHandler("This will take you to my GitHub Profile!"))
      .on("a#url", new ElementHandler("Go to stefanwerleman"))
      .on("a#url", new AttributeRewriter("href", GITHUB_URL));

   return rewriter.transform(response);
}

// Customization for Variant 2
async function customizeVariant2(response)
{
   const rewriter = new HTMLRewriter()
      .on("title", new ElementHandler("My LinkedIn"))
      .on("h1#title", new ElementHandler("My LinkedIn"))
      .on("p#description", new ElementHandler("This will take you to my LinkedIn Profile!"))
      .on("a#url", new ElementHandler("Go to stefanwerleman"))
      .on("a#url", new AttributeRewriter("href", LINKEDIN_URL));

   return rewriter.transform(response);
}

async function handleRequest(request)
{
   // Makes fetch request
   const response = await fetch(API_URL);
   const data = await response.json();

   // Capturing array of URLS
   var variants = data.variants;

   // Randomly choose a URL
   var index = Math.round(Math.random());
   var url = variants[index];

   // Reponse for HTMLRewriter
   var variantResponse = await fetch(url);

   var endpoint = url.slice(url.length - 2, url.length);
   var webpage = null;

   // Determine which page to customize
   if (endpoint === VARIANT_ONE_ENDPOINT)
   {
      webpage = customizeVariant1(variantResponse);
   }
   else
   {
      webpage = customizeVariant2(variantResponse);
   }

   // Returning webpage
   return webpage;
}

addEventListener("fetch", function(event)
{
   event.respondWith(handleRequest(event.request));
});
