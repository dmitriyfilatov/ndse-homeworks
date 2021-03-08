# MongoDB

## Insert
```js
db.books.insertMany([
    {
        title: "Carrie", 
        decription: " His first published novel", 
        authors: "Stephen King",
    },
    {
        title: "Tunnel in the Sky", 
        decription: "The story describes a group of students sent on a survival test to an uninhabited planet, who soon realise they are stranded there. The themes of the work include the difficulties of growing up and the nature of man as a social animal", 
        authors: "Robert A. Heinlein",
    },
])
```

## Find
```js
db.books.find({{ title: "Carrie" }}).limit(1)
```

## Update
```js
db.books.updateOne({_id: 123}, {description: "new desc", authors: "Ivanov I.I."})
```