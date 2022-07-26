class hashTable {
    storage = new Array(3);
    items= 0;

    getHashIndex( key , storageLen){
        let hash = 67;
        for (let i = 0; i < key.length; i++) {
            hash = (97 * hash * key.charCodeAt(i)) % storageLen;
            if (!hash) break;
        }
        return hash;
    }
    loadBalance(){
        const newStorage = new Array(this.storage.length * 2);
        this.storage.forEach((item)=>{
            if(item){
                item.forEach(([key, value])=>{
                    const newHash = this.getHashIndex(key, newStorage.length);
                    if ( newStorage[newHash])
                    newStorage[newHash].push([key, value]);
                    else
                    newStorage[newHash] = [[key, value]];
                });
            }
        });
        this.storage = newStorage
    }


    set(key, value){
        this.items++;
        const load = this.items / this.storage.length;
        if(load > 0.7) this.loadBalance();

        const hash = this.getHashIndex(key, this.storage.length);
        if ( this.storage[hash])
            this.storage[hash].push([key, value]);
        else
            this.storage[hash] = [[key, value]];
        
    }

    get(key){
        const hash = this.getHashIndex(key, this.storage.length);
        if(!this.storage[hash]) return null;
        const item = this.storage[hash].find((x) => x[0]===key);
        return item ? item : null;
    }
    pop(key){
        this.items--;
        const hash = this.getHashIndex(key, this.storage.length);
        this.storage[hash] = this.storage[hash].filter(x=> !(x[0]===key));
        
    }
}

ht = new hashTable();

document.getElementById('save').addEventListener('click', function(){

   const fName = document.getElementById('fName');
   const lName = document.getElementById('lName');
   if(fName.value.replaceAll(' ','') == "" || lName.value.replaceAll(' ','') == "" ) return alert("Please fill out the input fields");

   ht.set(fName.value, lName.value);
   fName.value = ""; 
   lName.value = "";
   document.getElementById('storage').textContent = ht.storage.length;
   alert('Saved Successfully');
});


document.getElementById('fNameBtn').addEventListener('click', function(){

    const fName = document.getElementById('fName').value;
    if(fName.replaceAll(' ','') == "") return alert("Please enter first name for get full name");
    fullName = ht.get(fName);
    if(!fullName) return alert("Given name not in table");
    document.getElementById('result').textContent = `${fullName[0]} ${fullName[1]}`;

});

document.addEventListener('keyup', function(event){
    if(event.code == "Enter") document.getElementById('save').click()
});