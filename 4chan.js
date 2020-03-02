const req =  require('request');

// Returns list of Thread Numbers that match query
function findThreads(board, query){
  return new Promise((resolve, reject) => {
    getCatalogue(board).then( res => {
      matches = []
      res.forEach(t =>{
        if ((t.sub && t.sub.toLowerCase().includes(query)) ||
            (t.com && t.com.toLowerCase().includes(query))) { matches.push(t)}
      })
      if (matches.length == 0) return reject('No Matches for '+query+' on board: '+board)
      //console.log('Matches: '+ matches.length)
      resolve(matches)
    }).catch( err => { return reject(err) })
  })
}

// Returns list of all threads on specified boardo
function getCatalogue(board){
  return new Promise((resolve, reject) => {
    req(`https://a.4cdn.org/${board}/catalog.json`, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        threads = []
        JSON.parse(body).forEach(x=>{
          threads= threads.concat(x.threads) })
        return resolve(threads)
      }
      else if (!err && res.statusCode == 404) return reject('Invalid  Board: '+ board)
      else{
        if (err) return reject(err)
        else return reject('Query for Board: '+board+' returned Status Code: '+res.statusCode)
    }})
  })
}

function getThread(board, no){
  return new Promise((resolve, reject) => {
    req(`https://a.4cdn.org/${board}/thread/${no}.json`, (err, res, body) => {
      if (!err && res.statusCode == 200) {
        return resolve(JSON.parse(body))
      }else if (!err && res.statusCode == 404) return reject('Invalid  Board/thread: '+ board+'/'+no)
      else return reject(err)
    })
  })
}

// Returns array of Thread(s) JSON(s)
function getThreads(board, noList) {
  return new Promise((resolve, reject) =>{
  // Make Array if sinlge object
  if(!Array.isArray(noList)){noList = [noList] }
  promiseList = []
  noList.forEach(no =>{ promiseList.push(getThread(board, no)) })
  Promise.all(promiseList)
  .then( threads => {
    //console.log('Threads: '+ threads.length)
    return resolve(threads)
  })
  .catch( err => {return reject(err)})
  })
}

// Return all comments in list for multiple threads
function getAllComments(board, noList) {
  return new Promise((resolve, reject) => {
    comments = []
    getThreads(board, noList)
    .then(threads =>{
      threads.forEach(t=>{
        comments= [...comments, ...t.posts]
      })
      //console.log('Comments: '+comments.length)
      return resolve(comments)
    })
    .catch(err =>{return reject(err)})
  })
}

function getNoList(threads){
  noList = []
  threads.forEach(x => {
    noList.push(x.no)
  })
  return noList
}

// Like getAllComments, but only returns a list of images
function getAllImages(board, threads) {
  return new Promise((resolve, reject) => {
    // Make Array if sinlge object
    if(!Array.isArray(threads)){ threads = [threads] }
    noList= getNoList(threads)
    //console.log('NoList: ' + noList)
    images = []
    getAllComments(board, noList)
    .then(cList =>{
      cList.forEach(c=>{
        if (c.filename){ images.push(`https://i.4cdn.org/${board}/${c.tim}${c.ext}`) }
      })
      return resolve(images)
    })
    .catch(err =>{return reject(err)})
    })
}

function queryRandom(board, query) {
  return new Promise((resolve, reject) => {
    findThreads(board, query).then(threads=>{
      getAllImages(board ,threads)
      .then(imgs =>{
        return resolve(imgs[Math.floor(Math.random() * imgs.length)])
      }).catch(err=>{
        return reject(err)
      })
    }).catch(err=>{
      return reject(err)
    })
  })
}

if (typeof require !== 'undefined' && require.main === module) {
  queryRandom('gif','ylyl')
  .then(img =>{
    console.log(img)
  }).catch(err=> console.log(err))
}


module.exports = {
  findThreads,
  getAllImages,
  getCatalogue,
  queryRandom
}
