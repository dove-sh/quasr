export default async function(){
    var newdoc = new storage.test({test: 'asdfasdf'});
    await newdoc.save();
    console.log(newdoc);
}