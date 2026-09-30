import type { MongodbLesson } from '../mongodb-curriculum';

export const mongodbCrudLesson: MongodbLesson = {
  id: 'mongodb-crud',
  title: 'CRUD Operations',
  slug: 'crud-basics',
  chapter: 'crud',
  order: 3,
  difficulty: 'beginner',
  readingTime: 18,
  description: 'Create, Read, Update, Delete operations - insertOne, find, updateOne, deleteOne and their bulk variants.',
  sections: [
    {
      type: 'text',
      content: 'CRUD operations are the foundation of working with MongoDB. Create (insert), Read (find), Update (modify), and Delete (remove) documents. MongoDB provides both single-document and bulk operations for each CRUD action.',
    },
    {
      type: 'heading',
      content: 'Create - Inserting Documents',
    },
    {
      type: 'example',
      title: 'insertOne() - Insert a single document',
      content: 'insertOne() adds a single document to the collection and returns an acknowledged result with the auto-generated _id.',
      language: 'javascript',
      code: `// Insert one document
db.users.insertOne({
  name: "Alice Johnson",
  email: "alice@example.com",
  age: 28,
  skills: ["JavaScript", "Python"],
  createdAt: new Date()
});

// Returns:
// {
//   acknowledged: true,
//   insertedId: ObjectId("507f1f77bcf86cd799439011")
// }

// The _id field is auto-generated if not provided`,
      output: '{ acknowledged: true, insertedId: ObjectId("507f1f77bcf86cd799439011") }',
    },
    {
      type: 'example',
      title: 'insertMany() - Insert multiple documents',
      content: 'insertMany() inserts an array of documents in a single operation, which is significantly faster than calling insertOne() in a loop.',
      language: 'javascript',
      code: `// Insert multiple documents at once
db.users.insertMany([
  {
    name: "Bob Smith",
    email: "bob@example.com",
    age: 32,
    skills: ["Java", "SQL"]
  },
  {
    name: "Carol White",
    email: "carol@example.com",
    age: 25,
    skills: ["React", "MongoDB"]
  },
  {
    name: "David Brown",
    email: "david@example.com",
    age: 30
  }
]);

// Returns:
// {
//   acknowledged: true,
//   insertedIds: {
//     '0': ObjectId("507f1f77bcf86cd799439012"),
//     '1': ObjectId("507f1f77bcf86cd799439013"),
//     '2': ObjectId("507f1f77bcf86cd799439014")
//   }
// }`,
      output: 'Inserted 3 documents',
    },
    {
      type: 'heading',
      content: 'Read - Finding Documents',
    },
    {
      type: 'example',
      title: 'find() - Query documents',
      content: 'find() returns a cursor to all matching documents. Use a filter object to narrow results, a projection object to select fields, and chain .sort(), .limit(), and .skip() for pagination and ordering.',
      language: 'javascript',
      code: `// Find all documents
db.users.find()

// Find with a filter
db.users.find({ age: 28 })

// Find with multiple conditions
db.users.find({ age: 28, name: "Alice Johnson" })

// Find and return only specific fields (projection)
db.users.find(
  { age: { $gte: 25 } },
  { name: 1, email: 1, _id: 0 }  // 1 = include, 0 = exclude
)

// Limit results
db.users.find().limit(5)

// Sort results
db.users.find().sort({ age: -1 })  // -1 = descending, 1 = ascending

// Skip and limit (pagination)
db.users.find().skip(10).limit(5)  // Skip first 10, return next 5`,
    },
    {
      type: 'example',
      title: 'findOne() - Find a single document',
      content: 'findOne() returns the first matching document as a plain object (not a cursor), or null if no match exists. Use it when you expect exactly one result, such as looking up a user by email.',
      language: 'javascript',
      code: `// Find first matching document
db.users.findOne({ name: "Alice Johnson" })

// Returns:
// {
//   _id: ObjectId("507f1f77bcf86cd799439011"),
//   name: "Alice Johnson",
//   email: "alice@example.com",
//   age: 28,
//   skills: ["JavaScript", "Python"],
//   createdAt: ISODate("2024-03-20T10:30:00Z")
// }

// Returns null if no match found
db.users.findOne({ name: "NonExistent" })  // null`,
    },
    {
      type: 'heading',
      content: 'Update - Modifying Documents',
    },
    {
      type: 'example',
      title: 'updateOne() - Update a single document',
      content: 'updateOne() modifies the first document that matches the filter using update operators like $set, $push, and $unset. It never overwrites the whole document, only the fields you specify.',
      language: 'javascript',
      code: `// Update first matching document
db.users.updateOne(
  { name: "Alice Johnson" },  // filter
  { $set: { age: 29 } }        // update operation
)

// Returns:
// {
//   acknowledged: true,
//   matchedCount: 1,
//   modifiedCount: 1
// }

// Update multiple fields
db.users.updateOne(
  { email: "alice@example.com" },
  {
    $set: {
      age: 29,
      city: "Boston",
      lastModified: new Date()
    }
  }
)

// Add to array
db.users.updateOne(
  { name: "Alice Johnson" },
  { $push: { skills: "MongoDB" } }
)

// Remove a field
db.users.updateOne(
  { name: "Alice Johnson" },
  { $unset: { city: "" } }
)`,
      output: '{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }',
    },
    {
      type: 'example',
      title: 'updateMany() - Update multiple documents',
      content: 'updateMany() applies the same update operation to every document that matches the filter. Pass an empty filter {} to update the entire collection, such as adding a default field to all documents.',
      language: 'javascript',
      code: `// Update all matching documents
db.users.updateMany(
  { age: { $lt: 30 } },  // filter: age less than 30
  { $set: { category: "young professional" } }
)

// Returns:
// {
//   acknowledged: true,
//   matchedCount: 3,
//   modifiedCount: 3
// }

// Increment all ages by 1
db.users.updateMany(
  {},  // empty filter = all documents
  { $inc: { age: 1 } }
)`,
      output: '{ acknowledged: true, matchedCount: 4, modifiedCount: 4 }',
    },
    {
      type: 'example',
      title: 'replaceOne() - Replace entire document',
      content: 'replaceOne() swaps out the entire document body (except _id) with the new object you provide. Unlike updateOne(), any fields you omit are deleted from the document.',
      language: 'javascript',
      code: `// Replace entire document (keeps _id)
db.users.replaceOne(
  { name: "Alice Johnson" },
  {
    name: "Alice Johnson",
    email: "alice.new@example.com",
    age: 29,
    status: "active"
  }
)

// All old fields are removed except _id
// New document structure replaces the old one`,
    },
    {
      type: 'heading',
      content: 'Delete - Removing Documents',
    },
    {
      type: 'example',
      title: 'deleteOne() - Delete a single document',
      content: 'deleteOne() removes the first document matching the filter and returns how many were deleted. Always filter by _id when you want to guarantee you delete exactly the right document.',
      language: 'javascript',
      code: `// Delete first matching document
db.users.deleteOne({ name: "Bob Smith" })

// Returns:
// {
//   acknowledged: true,
//   deletedCount: 1
// }

// Delete by _id
db.users.deleteOne({ _id: ObjectId("507f1f77bcf86cd799439011") })`,
      output: '{ acknowledged: true, deletedCount: 1 }',
    },
    {
      type: 'example',
      title: 'deleteMany() - Delete multiple documents',
      content: 'deleteMany() removes all documents matching the filter at once. Passing an empty filter {} deletes everything in the collection, so use this with caution in production.',
      language: 'javascript',
      code: `// Delete all matching documents
db.users.deleteMany({ age: { $lt: 25 } })

// Returns:
// {
//   acknowledged: true,
//   deletedCount: 3
// }

// Delete all documents in collection
db.users.deleteMany({})  // Deletes everything!

// Drop entire collection (faster than deleteMany)
db.users.drop()`,
      output: '{ acknowledged: true, deletedCount: 3 }',
    },
    {
      type: 'table',
      title: 'CRUD Operations Summary',
      headers: ['Operation', 'Method', 'Description'],
      rows: [
        ['Create One', 'insertOne(doc)', 'Insert a single document'],
        ['Create Many', 'insertMany([docs])', 'Insert multiple documents'],
        ['Read All', 'find(filter)', 'Find all matching documents'],
        ['Read One', 'findOne(filter)', 'Find first matching document'],
        ['Update One', 'updateOne(filter, update)', 'Update first match'],
        ['Update Many', 'updateMany(filter, update)', 'Update all matches'],
        ['Replace One', 'replaceOne(filter, doc)', 'Replace entire document'],
        ['Delete One', 'deleteOne(filter)', 'Delete first match'],
        ['Delete Many', 'deleteMany(filter)', 'Delete all matches'],
      ],
    },
    {
      type: 'note',
      title: 'Update Operators',
      content: 'Common update operators: $set (set field value), $unset (remove field), $inc (increment number), $push (add to array), $pull (remove from array), $addToSet (add to array if not exists), $rename (rename field).',
    },
    {
      type: 'tryit',
      title: 'MongoDB CRUD Playground',
      css: `*{box-sizing:border-box}body{font-family:system-ui,sans-serif;padding:0;margin:0;background:#001E2B;}
#app{display:grid;grid-template-columns:260px 1fr;min-height:100vh;max-height:600px;}
.sidebar{background:#002333;border-right:1px solid #0f3d4a;padding:14px;overflow-y:auto;}
.main{padding:14px;overflow-y:auto;background:#001E2B;}
.sidebar-title{color:#00ED64;font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.08em;margin-bottom:10px;}
.op-section{margin-bottom:14px;}
.op-label{color:#9ec5d0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px;}
.op-btn{display:block;width:100%;text-align:left;padding:7px 10px;border:none;border-radius:6px;cursor:pointer;font-size:12px;font-weight:600;margin-bottom:3px;transition:all .12s;}
.op-btn:hover{filter:brightness(1.15);}
.op-btn.create{background:#00ED6422;color:#00ED64;border:1px solid #00ED6444;}
.op-btn.read{background:#3b82f622;color:#60a5fa;border:1px solid #3b82f644;}
.op-btn.update{background:#f59e0b22;color:#fbbf24;border:1px solid #f59e0b44;}
.op-btn.delete{background:#ef444422;color:#f87171;border:1px solid #ef444444;}
.op-btn.active{filter:brightness(1.3);font-weight:800;}
.form-group{margin-bottom:8px;}
.form-label{display:block;color:#9ec5d0;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:3px;}
.form-input{width:100%;padding:6px 8px;background:#002333;border:1px solid #0f3d4a;border-radius:5px;color:#e2f0f5;font-size:12px;font-family:monospace;outline:none;}
.form-input:focus{border-color:#00ED64;}
.run-btn{width:100%;padding:8px;background:#00ED64;color:#001E2B;border:none;border-radius:6px;font-weight:800;font-size:12px;cursor:pointer;margin-top:6px;}
.run-btn:hover{background:#00ff70;}
.section-title{color:#00ED64;font-size:13px;font-weight:700;margin-bottom:8px;}
.cmd-box{background:#002333;border:1px solid #0f3d4a;border-radius:6px;padding:10px;font-family:monospace;font-size:11px;color:#7dd3fc;margin-bottom:10px;white-space:pre-wrap;}
.result-box{background:#002333;border:1px solid #0f3d4a;border-radius:6px;padding:10px;font-family:monospace;font-size:11px;color:#a7f3d0;margin-bottom:10px;white-space:pre-wrap;min-height:40px;}
.result-label{font-size:10px;color:#9ec5d0;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:4px;}
.docs-title{color:#9ec5d0;font-size:11px;font-weight:700;margin-bottom:6px;display:flex;justify-content:space-between;}
.doc-card{background:#002333;border:1px solid #0f3d4a;border-radius:6px;padding:8px 10px;margin-bottom:5px;font-family:monospace;font-size:11px;}
.doc-id{color:#f59e0b;font-size:10px;margin-bottom:3px;}
.doc-field{color:#9ec5d0;}
.doc-val{color:#a7f3d0;}
.doc-skills{color:#60a5fa;}
.highlight{border-color:#00ED64!important;background:#001e0a!important;}
.deleted{opacity:.35;text-decoration:line-through;}
.badge{display:inline-block;padding:1px 6px;border-radius:999px;font-size:9px;font-weight:700;margin-left:4px;}
.badge-new{background:#00ED6433;color:#00ED64;}
.badge-upd{background:#f59e0b33;color:#fbbf24;}
.op-count{font-size:10px;color:#6b8a94;margin-top:6px;}`,
      js: `var idCounter = 4;
var highlightId = null;
var activeOp = 'insertOne';
var opCounts = { insertOne:0, find:0, updateOne:0, deleteOne:0 };

var db = [
  { _id: 1, name:'Alice Johnson', email:'alice@example.com', age:28, city:'Boston', skills:['JavaScript','Python'], _state:'' },
  { _id: 2, name:'Bob Smith',     email:'bob@example.com',   age:32, city:'NYC',    skills:['Java','SQL'],          _state:'' },
  { _id: 3, name:'Carol White',   email:'carol@example.com', age:25, city:'Boston', skills:['React','MongoDB'],     _state:'' }
];

function setActive(op) {
  activeOp = op;
  var panels = { insertOne:'panelInsert', find:'panelFind', updateOne:'panelUpdate', deleteOne:'panelDelete' };
  ['panelInsert','panelFind','panelUpdate','panelDelete'].forEach(function(p){
    var el = document.getElementById(p);
    if(el) el.style.display = 'none';
  });
  var target = document.getElementById(panels[op]);
  if(target) target.style.display = 'block';
  ['btnInsert','btnFind','btnUpdate','btnDelete'].forEach(function(b){
    var el = document.getElementById(b);
    if(el) el.classList.remove('active');
  });
  var btnMap = { insertOne:'btnInsert', find:'btnFind', updateOne:'btnUpdate', deleteOne:'btnDelete' };
  var btn = document.getElementById(btnMap[op]);
  if(btn) btn.classList.add('active');
  renderCmd();
}

function getCmd() {
  var cmds = {
    insertOne: function(){
      var n=v('iName'), e=v('iEmail'), a=v('iAge'), c=v('iCity'), sk=v('iSkills');
      return 'db.users.insertOne({\   name: "'+n+'",\   email: "'+e+'",\   age: '+a+',\   city: "'+c+'",\   skills: ['+sk.split(',').map(function(s){return '"'+s.trim()+'"';}).join(', ')+']\ });';
    },
    find: function(){
      var f = v('fFilter');
      var parsed = {};
      try { if(f&&f!=='{}') parsed=JSON.parse(f); } catch(e){}
      var keys = Object.keys(parsed);
      if(!keys.length) return 'db.users.find();';
      return 'db.users.find({\   '+keys.map(function(k){return k+': '+JSON.stringify(parsed[k]);}).join(',\   ')+'\ });';
    },
    updateOne: function(){
      var f=v('uFilter'), op=v('uOperator'), field=v('uField'), val=v('uValue');
      return 'db.users.updateOne(\   { '+f+' },\   { '+op+': { '+field+': '+JSON.stringify(isNaN(val)?val:Number(val))+' } }\ );';
    },
    deleteOne: function(){
      var f=v('dFilter');
      return 'db.users.deleteOne({ '+f+' });';
    }
  };
  return cmds[activeOp]();
}

function v(id){ var el=document.getElementById(id); return el?el.value:''; }

function renderCmd() {
  var el = document.getElementById('cmdDisplay');
  if(el) el.textContent = getCmd();
}

function runOp() {
  opCounts[activeOp]++;
  var resultEl = document.getElementById('resultDisplay');
  highlightId = null;

  if(activeOp==='insertOne'){
    var n=v('iName'),e=v('iEmail'),a=parseInt(v('iAge'))||20,c=v('iCity'),sk=v('iSkills');
    var newDoc={ _id:++idCounter, name:n||'New User', email:e||'user@example.com', age:a, city:c||'Unknown', skills:sk.split(',').map(function(s){return s.trim();}).filter(Boolean), _state:'new' };
    db.push(newDoc);
    highlightId = newDoc._id;
    if(resultEl) resultEl.textContent = '{\   acknowledged: true,\   insertedId: '+newDoc._id+'\ }';
  }
  else if(activeOp==='find'){
    var filterStr = v('fFilter');
    var filter = {};
    try { if(filterStr&&filterStr!=='{}') filter=JSON.parse(filterStr); } catch(e){}
    var keys = Object.keys(filter);
    var matches = db.filter(function(doc){
      if(doc._state==='deleted') return false;
      return keys.every(function(k){
        if(k==='age'&&typeof filter[k]==='object'){
          var op=Object.keys(filter[k])[0];
          if(op==='$gte') return doc[k]>=filter[k][op];
          if(op==='$lte') return doc[k]<=filter[k][op];
          if(op==='$gt')  return doc[k]>filter[k][op];
          if(op==='$lt')  return doc[k]<filter[k][op];
        }
        return String(doc[k])===String(filter[k]);
      });
    });
    if(resultEl) resultEl.textContent = 'Found '+matches.length+' document(s):\ '+matches.map(function(d){return '{ _id:'+d._id+', name:"'+d.name+'", age:'+d.age+', city:"'+d.city+'" }';}).join('\ ');
  }
  else if(activeOp==='updateOne'){
    var fStr=v('uFilter'), op=v('uOperator'), field=v('uField'), val=v('uValue');
    var parts=fStr.replace(/"/g,'').split(':');
    var fk=parts[0]?parts[0].trim():'name', fv=parts[1]?parts[1].trim():'';
    var idx=db.findIndex(function(d){ return d._state!=='deleted' && String(d[fk])===String(fv); });
    if(idx===-1){
      if(resultEl) resultEl.textContent='{ acknowledged: true, matchedCount: 0, modifiedCount: 0 }';
    } else {
      var numVal = isNaN(val)?val:Number(val);
      if(op==='$set') db[idx][field]=numVal;
      else if(op==='$inc') db[idx][field]=(Number(db[idx][field])||0)+Number(val);
      else if(op==='$push'){ if(!Array.isArray(db[idx][field]))db[idx][field]=[]; db[idx][field].push(val); }
      else if(op==='$unset') delete db[idx][field];
      db[idx]._state='updated';
      highlightId=db[idx]._id;
      if(resultEl) resultEl.textContent='{ acknowledged: true, matchedCount: 1, modifiedCount: 1 }';
    }
  }
  else if(activeOp==='deleteOne'){
    var fStr=v('dFilter');
    var parts=fStr.replace(/"/g,'').split(':');
    var fk=parts[0]?parts[0].trim():'name', fv=parts[1]?parts[1].trim():'';
    var idx=db.findIndex(function(d){ return d._state!=='deleted' && String(d[fk])===String(fv); });
    if(idx===-1){
      if(resultEl) resultEl.textContent='{ acknowledged: true, deletedCount: 0 }';
    } else {
      db[idx]._state='deleted';
      highlightId=db[idx]._id;
      if(resultEl) resultEl.textContent='{ acknowledged: true, deletedCount: 1 }';
    }
  }

  renderDocs();
  renderOpCount();
}

function renderDocs(){
  var list = document.getElementById('docList');
  if(!list) return;
  var active = db.filter(function(d){return d._state!=='deleted';});
  var html = '<div class="docs-title"><span>Collection: users <span style="color:#6b8a94">('+active.length+' docs)</span></span></div>';
  db.forEach(function(doc){
    var hi = doc._id===highlightId;
    var cls = 'doc-card'+(hi?' highlight':'')+(doc._state==='deleted'?' deleted':'');
    var badge = doc._state==='new'?'<span class="badge badge-new">NEW</span>':doc._state==='updated'?'<span class="badge badge-upd">UPDATED</span>':'';
    var skills = Array.isArray(doc.skills)?doc.skills:[];
    html += '<div class="'+cls+'">'+
      '<div class="doc-id">_id: '+doc._id+badge+'</div>'+
      '<div><span class="doc-field">name:</span> <span class="doc-val">"'+doc.name+'"</span>  '+
      '<span class="doc-field">age:</span> <span class="doc-val">'+(doc.age||'?')+'</span>  '+
      '<span class="doc-field">city:</span> <span class="doc-val">'+(doc.city||'?')+'</span></div>'+
      (skills.length?'<div><span class="doc-field">skills:</span> <span class="doc-skills">['+skills.map(function(s){return '"'+s+'"';}).join(', ')+']</span></div>':'')+
    '</div>';
  });
  list.innerHTML = html;
}

function renderOpCount(){
  var el = document.getElementById('opCount');
  if(el) el.textContent = 'Operations - insert:'+opCounts.insertOne+' find:'+opCounts.find+' update:'+opCounts.updateOne+' delete:'+opCounts.deleteOne;
}

document.getElementById('output').innerHTML =
'<div id=\\"app\\">'+
  '<div class=\\"sidebar\\">'+
    '<div class=\\"sidebar-title\\">MongoDB CRUD</div>'+
    '<div class=\\"op-section\\">'+
      '<div class=\\"op-label\\">Create</div>'+
      '<button id=\\"btnInsert\\" class=\\"op-btn create active\\" onclick=\\"setActive(\\'insertOne\\')\\">insertOne()</button>'+
    '</div>'+
    '<div class=\\"op-section\\">'+
      '<div class=\\"op-label\\">Read</div>'+
      '<button id=\\"btnFind\\" class=\\"op-btn read\\" onclick=\\"setActive(\&apos;find\&apos;)\\">find()</button>'+
    '</div>'+
    '<div class=\\"op-section\\">'+
      '<div class=\\"op-label\\">Update</div>'+
      '<button id=\\"btnUpdate\\" class=\\"op-btn update\\" onclick=\\"setActive(\\'updateOne\\')\\">updateOne()</button>'+
    '</div>'+
    '<div class=\\"op-section\\">'+
      '<div class=\\"op-label\\">Delete</div>'+
      '<button id=\\"btnDelete\\" class=\\"op-btn delete\\" onclick=\\"setActive(\\'deleteOne\\')\\">deleteOne()</button>'+
    '</div>'+
    '<div id=\\"panelInsert\\">'+
      '<div class=\\"op-label\\" style=\\"margin-top:8px\\">Parameters</div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">name</label><input id=\\"iName\\" class=\\"form-input\\" value=\\"Dave Brown\\"></div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">email</label><input id=\\"iEmail\\" class=\\"form-input\\" value=\\"dave@example.com\\"></div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">age</label><input id=\\"iAge\\" class=\\"form-input\\" value=\\"29\\" type=\\"number\\"></div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">city</label><input id=\\"iCity\\" class=\\"form-input\\" value=\\"Seattle\\"></div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">skills (comma-sep)</label><input id=\\"iSkills\\" class=\\"form-input\\" value=\\"TypeScript, Node.js\\"></div>'+
      '<button class=\\"run-btn\\" onclick=\\"runOp()\\">▶ Run insertOne()</button>'+
    '</div>'+
    '<div id=\\"panelFind\\" style=\\"display:none\\">'+
      '<div class=\\"op-label\\" style=\\"margin-top:8px\\">Filter (JSON)</div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">filter</label><input id=\\"fFilter\\" class=\\"form-input\\" value=\\\'{\\\\\\"city\\\\\\":\\\\\\"Boston\\\\\\"}\\\'></div>'+
      '<div style=\\"font-size:10px;color:#6b8a94;margin-bottom:6px\\">Try: {} | {\\\\\\"city\\\\\\":\\\\\\"NYC\\\\\\"} | {\\\\\\"age\\\\\\":{\\\\\\"$gte\\\\\\":28}}</div>'+
      '<button class=\\"run-btn\\" onclick=\\"runOp()\\">▶ Run find()</button>'+
    '</div>'+
    '<div id=\\"panelUpdate\\" style=\\"display:none\\">'+
      '<div class=\\"op-label\\" style=\\"margin-top:8px\\">Update Params</div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">filter (field:value)</label><input id=\\"uFilter\\" class=\\"form-input\\" value=\\\'name:\\\\\\"Alice Johnson\\\\\\"\\\'></div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">operator</label>'+
        '<select id=\\"uOperator\\" class=\\"form-input\\"><option value=\\"$set\\">$set</option><option value=\\"$inc\\">$inc</option><option value=\\"$push\\">$push</option><option value=\\"$unset\\">$unset</option></select>'+
      '</div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">field</label><input id=\\"uField\\" class=\\"form-input\\" value=\\"age\\"></div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">value</label><input id=\\"uValue\\" class=\\"form-input\\" value=\\"29\\"></div>'+
      '<button class=\\"run-btn\\" onclick=\\"runOp()\\">▶ Run updateOne()</button>'+
    '</div>'+
    '<div id=\\"panelDelete\\" style=\\"display:none\\">'+
      '<div class=\\"op-label\\" style=\\"margin-top:8px\\">Filter</div>'+
      '<div class=\\"form-group\\"><label class=\\"form-label\\">filter (field:value)</label><input id=\\"dFilter\\" class=\\"form-input\\" value=\\\'name:\\\\\\"Bob Smith\\\\\\"\\\'></div>'+
      '<button class=\\"run-btn\\" style=\\"background:#ef4444;color:white\\" onclick=\\"runOp()\\">▶ Run deleteOne()</button>'+
    '</div>'+
    '<div id=\\"opCount\\" class=\\"op-count\\"></div>'+
  '</div>'+
  '<div class=\\"main\\">'+
    '<div class=\\"section-title\\">Command Preview</div>'+
    '<div id=\\"cmdDisplay\\" class=\\"cmd-box\\"></div>'+
    '<div class=\\"result-label\\">Result</div>'+
    '<div id=\\"resultDisplay\\" class=\\"result-box\\">Click Run to execute operation...</div>'+
    '<div id=\\"docList\\"></div>'+
  '</div>'+
'</div>';

['iName','iEmail','iAge','iCity','iSkills','fFilter','uFilter','uOperator','uField','uValue','dFilter'].forEach(function(id){
  var el=document.getElementById(id);
  if(el) el.addEventListener('input', renderCmd);
  if(el) el.addEventListener('change', renderCmd);
});
setActive('insertOne');
renderDocs();
renderOpCount();

window.setActive=setActive;
window.runOp=runOp;`,
    },
    {
      type: 'heading',
      content: 'Common mistakes beginners make',
    },
    {
      type: 'list',
      items: [
        'Calling updateOne with a plain object and no operator. Fix: wrap changes in an operator such as { $set: { age: 21 } }; use replaceOne when you really want to replace the whole document.',
        'Running deleteMany({}) or updateMany({}, ...) by accident and changing every document. Fix: check the filter with find() first, and be careful with an empty filter.',
        'Forgetting that find() returns a cursor. Fix: in a Node.js driver call .toArray() (or loop over the cursor); mongosh prints the results for you.',
        'Matching the wrong type, for example age: "20" when the stored value is the number 20. Fix: use the same type as the data.',
        'Inserting a duplicate _id or a duplicate value in a unique field. Fix: let MongoDB generate _id and handle the duplicate-key error (code 11000).',
        'Fetching whole documents when you need two fields. Fix: use a projection, such as find({}, { name: 1 }), and limit large results.',
      ],
    },
    {
      type: 'heading',
      content: 'Where you use this in real projects',
    },
    {
      type: 'list',
      items: [
        'User accounts and profiles: insert on sign-up, update on edit, delete on account removal.',
        'Product catalogues where items are searched, updated and removed.',
        'Blog posts and comments that are created and edited often.',
        'Shopping carts and orders that change as users shop.',
        'Application settings and logs stored as flexible documents.',
        'Admin panels for reviewing and editing data.',
      ],
    },
    {
      type: 'heading',
      content: 'Practice task: Practice all four CRUD operations',
    },
    {
      type: 'text',
      content: 'Open the starter in the MongoDB editor. It inserts three students. Then complete the four TODO steps: find the students in the Web course, add one year to Ravi\'s age with $inc, delete the student named Meera, and finally list what is left.',
    },
    {
      type: 'example',
      title: 'Starter code',
      content: 'Open this in the editor, complete the TODO parts and test with the tester that appears next to the code.',
      code: `// A small "students" collection
db.students.insertMany([
  { name: 'Asha', age: 20, course: 'Web' },
  { name: 'Ravi', age: 22, course: 'Data' },
  { name: 'Meera', age: 21, course: 'Web' }
]);

// TODO 1: find all students in the Web course

// TODO 2: increase Ravi's age by 1 with $inc

// TODO 3: delete the student named Meera

// TODO 4: list the remaining students
db.students.find();`,
      language: 'javascript',
    },
    {
      type: 'note',
      title: 'Expected result',
      content: 'Step 1 returns Asha and Meera. After steps 2 and 3 the final find() shows two documents: Asha (age 20, Web) and Ravi (age 23, Data).',
    },
    {
      type: 'tip',
      title: 'Hint',
      content: 'find takes a filter object: { course: "Web" }. For the update use db.students.updateOne({ name: "Ravi" }, { $inc: { age: 1 } }). deleteOne takes the same kind of filter.',
    },
    {
      type: 'example',
      title: 'Solution (try it yourself first)',
      content: 'One possible solution. Yours may look different and still be correct.',
      code: `db.students.insertMany([
  { name: 'Asha', age: 20, course: 'Web' },
  { name: 'Ravi', age: 22, course: 'Data' },
  { name: 'Meera', age: 21, course: 'Web' }
]);

// 1. read: students in the Web course
db.students.find({ course: 'Web' });

// 2. update: Ravi is a year older
db.students.updateOne({ name: 'Ravi' }, { $inc: { age: 1 } });

// 3. delete: remove Meera
db.students.deleteOne({ name: 'Meera' });

// 4. read again: what is left
db.students.find();`,
      language: 'javascript',
    },
    {
      type: 'heading',
      content: 'Frequently asked questions',
    },
    {
      type: 'note',
      title: 'What is the _id field?',
      content: 'The unique identifier of every document. MongoDB creates an ObjectId for you unless you supply your own value.',
    },
    {
      type: 'note',
      title: 'What is the difference between updateOne and replaceOne?',
      content: 'updateOne changes only the fields named in an operator like $set and keeps the rest. replaceOne swaps the whole document (except _id) with the new one.',
    },
    {
      type: 'note',
      title: 'How do I return only some fields?',
      content: 'Pass a projection as the second argument: db.users.find({}, { name: 1, email: 1 }).',
    },
    {
      type: 'note',
      title: 'Is MongoDB schema-less?',
      content: 'Its collections do not force a fixed structure, but you still need to design your documents. Tools like Mongoose let you add validation and structure in your app.',
    },
  ],
  exercises: [
    {
      id: 'mongodb-crud-1',
      question: 'Which method inserts a single document into MongoDB?',
      type: 'multiple-choice',
      options: [
        'db.collection.insert()',
        'db.collection.insertOne()',
        'db.collection.add()',
        'db.collection.create()',
      ],
      correct: 1,
      explanation: 'insertOne() is the method to insert a single document. While insert() also works, insertOne() is the modern recommended approach that clearly indicates single document insertion.',
    },
    {
      id: 'mongodb-crud-2',
      question: 'What does db.users.updateOne({ name: "Alice" }, { $set: { age: 30 } }) do?',
      type: 'multiple-choice',
      options: [
        'Updates all users named Alice to age 30',
        'Updates the first user named Alice to age 30',
        'Creates a new user Alice with age 30',
        'Replaces the entire Alice document with { age: 30 }',
      ],
      correct: 1,
      explanation: 'updateOne() updates only the first document that matches the filter. It uses $set to update specific fields without affecting other fields. Use updateMany() to update all matching documents.',
    },
  ],
  quiz: [
    {
      id: 'mongodb-crud-q1',
      question: 'What is the difference between updateOne() and replaceOne()?',
      options: [
        'They are the same, just different names',
        'updateOne() modifies specific fields, replaceOne() replaces the entire document',
        'updateOne() is faster than replaceOne()',
        'replaceOne() can update multiple documents',
      ],
      correct: 1,
      explanation: 'updateOne() uses update operators like $set to modify specific fields while keeping other fields intact. replaceOne() replaces the entire document content (except _id) with a new document structure.',
    },
  ],
};
