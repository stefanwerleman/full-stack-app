const API_URL = "https://cfw-takehome.developers.workers.dev/api/variants";

addEventListener('fetch', event =>
{
   event.respondWith(handleRequest(event.request));
})

async function handleRequest(request)
{
   // Makes fetch request
   const response = await fetch(API_URL);
   const data = await response.json();

   // Capturing array of URLS
   var variants = data.variants;

   // Randomly chose a URL
   var index = Math.round(Math.random());
   var url = variants[index];

   // Returning new response
   return Response.redirect(url);;
}
