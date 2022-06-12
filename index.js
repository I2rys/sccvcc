"use strict";

// Dependencies
const request = require("request-async")
const Fs = require("fs")

// Variables
const args = process.argv.slice(2)

// args
if(!args.length) return console.log("node index.js <countryCode> <output>")
if(!args[1]) return console.log("Invalid output.")

var qualifiedLinks = []
var maxPage = true
var page = 0

args[0] = args[0].toLowerCase()

console.log("Scraping has started, please wait.\n")

scrapeCameras()
async function scrapeCameras(){
    if(page === maxPage){
        console.log()
        console.log(`${qualifiedLinks.length} camera's found.`)
        console.log(`Saving the results to ${args[1]} please wait.`)
        Fs.writeFileSync(args[1], qualifiedLinks.join("\n"), "utf8")
        console.log(`Results successfully saved to ${args[1]}`)
        console.log("Finished scraping.")
        process.exit()
    }

    var response = await request(`http://insecam.org/en/bycountry/${args[0]}/?page=${page}`)
    response = response.body

    if(response.indexOf("Page not found (404)") !== -1) return console.log("Invalid countryCode.")

    if(maxPage) maxPage = response.match(/pagenavigator\("\?page=", (\d+)/)[0].replace('pagenavigator("?page=", ', "")

    const links = response.match(/http:..\d+.\d+.\d+.\d+:\d+/g)
    
    for( const link of links ){
        if(qualifiedLinks.indexOf(link) === -1){
            console.log(link)
            qualifiedLinks.push(link)
        }
    }

    page++
    scrapeCameras()
}
