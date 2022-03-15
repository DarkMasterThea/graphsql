const express = require('express')
const {graphqlHTTP} = require('express-graphql')
const {buildSchema} = require('graphql')

var schema = buildSchema(`
  type Client {
    id: Int,
    name: String,
    phone: String
  }

  type Query {
    clients: [Client],
    client(id: Int): Client
  }

  type Mutation {
    addClient(name: String, phone: String): Client
  }
`);

var clients = []
var counter = 1

const root = {
    clients: () =>{return clients},
    client: (data)=>{
        for (var i=0; i< clients.length; i++){
            if (clients[i].id==data.id){
                return clients[i]
            }
        }
        return null
    },
    addClient: (data)=>{
        var c = {'id':counter, 'name':data.name, 'phone':data.phone}
        clients.push(c)
        counter++
        return c
    }
}
const app = express()

app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}),(rq,rs)=>{
    console.log(rq)
    console.log(rs)
})

app.listen(4000)