import * as request from 'request'
import * as fs from 'fs'
import * as URI from 'urijs'
// const URI = require('urijs')
import { Comico_API, List } from './Interface'

// http://www.comico.in.th/titles/73
// http://www.comico.in.th/titles/73/chapters?order=asc&start=1&count=1520


// 
// 
const URL = 'http://www.comico.in.th/titles/73';
const RootFolder = '/mnt/f/Comico/เมดสาวหน้าใสกับคุณชายปากร้าย/';



// 
// 
// fetchAPI(URL).then(comico => {
//     comico.data.list.forEach(element => {
//         fetch(`$${URL}/${element.id}`)
//     });
// })

(async () => {
    let comico = await fetchAPI(URL)
    let comico_free = comico.data.list.filter(free => free.salePolicy.isFree)
    for (let key of comico_free) {
        // console.log("Fetching.. #")
        let chapter = await fetch(`${URL}/chapters/${key.id}`)
        // let urls = extractImage(chapter)
        // let Image = urls.forEach(url => {

        // })
        let chapter_folder = `[${index_format(key.id)}] - ${key.name.replace(/[\\\/:\*\?"<>\|]/ig, ' ').replace(/\s+/ig, ' ')}/`
        fs.existsSync(RootFolder + chapter_folder) || fs.mkdirSync(RootFolder + chapter_folder)
        console.log('Downloading.. #', key.name)
        extractImage(chapter).forEach(async element => {
            let ext = URI(element.url).suffix()
            let Image = await saveImage(element.url)
            fs.writeFile(RootFolder + chapter_folder + index_format(element.page) + '.' + ext, Image, 'binary', (err) => {
                if (err) console.log(err)
            })
        })
        // break
    }
    console.log("Complete..")
    // comico.data.list.filter(free => free.salePolicy.isFree).forEach(async element => {
    //     let chapter = await fetch(`${URL}/${element.id}`)
    //     console.log(element.id)
    //     console.log(extractImage(chapter))
    // })

    // comico.data.list.forEach(async element => {
    //     let chapter = await fetch(`${URL}/${element.id}`)
    //     console.log(element.id)
    //     console.log(extractImage(chapter))
    //     return
    // })
})()




// 
// 
// input => http://www.comico.in.th/titles/73
function fetchAPI(url: string): Promise<Comico_API> {
    return new Promise((resolve, reject) => {
        request(`${url}/chapters?order=asc&start=1&count=999`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
            }
        }, (err, res, body) => {
            if (err) return reject(err)
            return resolve(JSON.parse(body))
        })
    })
}

function fetch(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        request(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
            }
        }, (err, res, body) => {
            if (err) return reject(err)
            return resolve(body)
        })
    })
}

/** Return Array Image */
function extractImage(text: string) {
    let regex = /<img class="_image" src="(.+)"\/>/ig
    let match
    let result: { url: string, page: number }[] = []
    let page = 1
    while (match = regex.exec(text)) {
        result.push({ url: match[1], page })
        page++
    }
    return result
}


function saveImage(url: string): Promise<any> {
    return new Promise((resolve, reject) => {
        request(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
            },
            encoding: 'binary'
        }, (err, res, body) => {
            if (err) return reject(err)
            return resolve(body)
        })
    })
}



function index_format(chapter: number) {
    return chapter > 9 ? "" + chapter : "0" + chapter;
}






/*
function fetchAPI(url: string, page = 1): Promise<Comico_API> {
    return new Promise((resolve, reject) => {
        request(url + `/chapters?page=${page}`, (err, res, body) => {
            if (err) return reject(err)
            return resolve(JSON.parse(body))
        })
    })
}

// http://www.comico.in.th/titles/73
async function resultAPI(url: string) {
    let result: Comico_API[] = []
    // let page = 1

    for (let page = 1; ; page++) {
        let comico = await fetchAPI(url, page)
        result.push(comico)
        if (comico.data.startIndex + 50 >= comico.data.totalItemCount) {
            break
        }
    }
    return result
}

function fetch(url: string) {
    return new Promise((resolve, reject) => {
        request(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36"
            }
        }, (err, res, body) => {
            if (err) return reject(err)
            return resolve(body)
        })
    })
}

function extractImage() {
    let regex = /<img class="_image" src="(.+)"\/>/ig
}
// 
// 
// 

const URL = 'http://www.comico.in.th/titles/73'
resultAPI(URL)
    .then(comico => {
        // let chapters = comico.map(chapters => chapters.data.list.map(chapter => chapter.name))
        // let chapters: { titleName: string, name: string, id: number }[] = []
        let chapters: List[] = []
        comico.forEach(elements => {
            elements.data.list.forEach(element => {
                chapters.push(element)
            })
        })
        return chapters
    }).then(chapters => {
        chapters.forEach(element => {
            fetch(`${URL}/${element.id}`)
                .then(body => {

                })
        })
    })

// fetchAPI('http://www.comico.in.th/titles/73').then(data => {
//     console.log(data.header)
// })
*/