// History Hash Table to store the latest replies to each user
// This will be useful for editing/deleting bot made replies

class hisHash{
   constructor(){
        this.table = new Array(256)
   }

   // Hash by discord userID snowflake
   hash(userID){
        const H = 27
        const K = userID % 37 
        return (userID + (H * K)) % this.table.length
   }

   // Builds hhob and sends it into hash table
   // Returns key of message
   // query is array[2] = [board,query]
   put(userID, query, reply, source= null){
       let key = this.hash(userID)
       // Linear probing for next free slot
       while(this.table[key] !== undefined && this.table[key].userID != userID){ // Overwrite if slot  belongs to curUser
            key +=1
       }
       this.table[key] = new hhob(userID, query, reply, source)
       return key
   }

   // Returns hhob of hash table, or null if not found
   get(userID){
       let key = this.hash(userID)
       while(this.table[key] !== undefined && this.table[key].userID != userID){ // Overwrite if slot  belongs to curUser
        key+=1
       }
       if(this.table[key] === undefined) return null 
       return this.table[key]

   }
}

// The object to be stored in the hisHash table
class hhob {
    constructor(userID, query, reply, source){
        this.userID = userID
        this.query = query
        this.message= reply 
        this.source = source // For adding source URL's
    }
}

module.exports= {
    hisHash
}