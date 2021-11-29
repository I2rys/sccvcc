//Dependencies
const Request = require("request")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Main
if(!Self_Args.length){
    console.log("node index.js <country_code> <output>")
    process.exit()
}

if(!Self_Args[1]){
    console.log("Invalid output.")
    process.exit()
}

var qualified_links = []
var max_page = true
var page = 0

Self_Args[0] = Self_Args[0].toLowerCase()

console.log("Scraping has started, please wait.")
console.log()
Scrape()
function Scrape(){
    if(page == max_page){
        console.log()
        Fs.writeFileSync(Self_Args[1], qualified_links.join("\n"), "utf8")
        console.log(`${qualified_links.length} camera's found and saved to ${Self_Args[1]}.`)
        console.log("Finished scraping.")
        process.exit()
    }

    Request(`https://www.insecam.org/en/bycountry/${Self_Args[0]}/?page=${page}`, function(err, res, body){
        if(body.indexOf("Page not found (404)") != -1){
            console.log("Invalid country_code.")
            process.exit()
        }

        if(max_page == true){
            max_page = body.match(/pagenavigator\("\?page=", (\d+)/)[0].replace('pagenavigator("?page=", ', "")
        }

        let links = body.match(/http:..\d+.\d+.\d+.\d+:\d+/g)
        
        for( i in links ){
            if(qualified_links.indexOf(links[i]) == -1){
                console.log(links[i])
                qualified_links.push(links[i])
            }
        }

        page++
        Scrape()
    })
}
