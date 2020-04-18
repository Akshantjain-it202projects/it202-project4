const covid_19_tracker = "COVID-19 TRACKER"
const assets = [
    "/",
    "/index.html",
    "/style.css",
    "/script.js",
    "/icons/android-chrome-192x192.png",
    "/icons/android-chrome-512x512.png",
    "/icons/apple-touch-icon.png",
    "/icons/favicon-16x16.png",
    "/icons/favicon-32x32.png",
    "/icons/favicon.ico",
]

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open(covid_19_tracker).then(cache => {
            cache.addAll(assets)
        })
    )
})

self.addEventListener("fetch", fetchEvent => {
    fetchEvent.respondWith(
        caches.match(fetchEvent.request).then(res => {
            return res || fetch(fetchEvent.request)
        })
    )
})