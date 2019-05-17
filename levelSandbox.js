/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/

const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);



class LevelSandbox{

constructor(){

}
// Add data to levelDB with key/value pair
async  addLevelDBData(key,value){
  return new Promise ((resolve , reject) =>{
  db.put(key,value, function(err) {
    if (err) return console.log('Block ' + key + ' submission failed', err);
    resolve('added Block')
  })
})
}

  getLevelDBData(key){
    
    return new Promise(function(resolve, reject) {
        db.get(key, (err, value) => {
            if(err){
                if (err.type == 'NotFoundError') {
                    resolve(undefined);
                }else {
                    console.log('Block ' + key + ' get failed', err);
                    reject(err);
                }
            }else {
                resolve(JSON.parse(value));
            }
        });
    })
}


// Add data to levelDB with value
 addDataToLevelDB(value) {
  
    let i = 0;
  db.createReadStream().on('data', function(data) {
          i++;
        }).on('error', function(err) {
            return console.log('Unable to read data stream!', err)
        }).on('close', function() {
          console.log('Block #' + i);
          addLevelDBData(i, value);
        });
}

//get number of blocks in leveldb
getBlocksCount() {
  
 return new Promise(function(resolve, reject){
let i = 0;
db.createReadStream().on('data', function(data) {
i++;
}).on('error', function(err) {
  reject(err)
return console.log('Unable to read data stream!', err);

}).on('close', function() {
resolve(i)
});
})
}
}

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/

module.exports.LevelSandbox = LevelSandbox;