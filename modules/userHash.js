// Hash table base clased used to store objects based on userID snowflake
class userHash{
   constructor(size= 256){
        this.table = new Array(size)
   }

   // Hash algo bs
   hash(userID){
        userID =  parseInt(userID)
        return (userID + (27 * userID%37)) % this.table.length
   }

   // Returns existing/new key
   // Returns Null if write == false
   genKey(userID, write = true){
       const hash= this.hash(userID)
       // Linear probing for next free slot
       for(let i=0;i<this.table.length;i++){
            let key = (hash+i) % this.table.length // Don't go over
            let item = this.table[key]
            if(item == undefined){
                if(!write)return null
                return key
            }else if(item.userID == userID)return key
       } // If table Full
       if(write){
           delete this.table[hash] // Clear old value
           return hash
       }else return null
   }

   // Builds Query and sends it into hash table
   // Returns key of message
   put(object, userID=null){
       if (userID) {
           if(object.hasOwnProperty('userID')){
           userID = object.userID
           }else {throw "userHash.put() requires a userID"}
       }
       let key = this.genKey(userID)
       this.table[key] = object
    //    return key
   }

   // Returns Query of hash table, or null if not found
   get(userID){
       let key = this.genKey(userID)
       return key !== null ? this.table[key] : null
   }
}

// queryHash table extends userHash to store queries
class queryHash extends userHash{
    put(userID, query, reply, source= null){
        super.put(new Query(userID, query, reply, source), userID)
    }
}

// JSON which can have custom functions later
class Query {
    constructor(userID, query, reply, source){
        this.userID = userID
        this.query = query
        this.message= reply
        this.source = source // TODO: For adding source URL's
    }
}

module.exports= {
    userHash,
    queryHash
}
