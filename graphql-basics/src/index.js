import { GraphQLServer } from 'graphql-yoga';

// Type definition (schema)
// Scalar Type or Data type in GraphQL 
// String , Boolean, Int, Float, ID

// Non Scalar Type
// Object and Array

// At the end of eact data type, there is "!" mark, that show that This type will return someting other than null. if you donot put "!" at the end of data type, it will give "null" value to it.

const typeDefs = `
    type Query{
        greetings(name: String, position: String): String!
        addValue(v1: Float!, v2: Float!): String!
        me: User!
        post: Post!
    }

    type User{
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post{
        id: ID!
        title: String!
        body: String!
        published: Int!
    }
`
const resolvers = {
    Query:{

        addValue(parent, args, ctr, info){
            if(args.v1 && args.v2){
                return  `Sum is ${args.v1}` + `${args.v2}`
            }
            else if(args){
                return args
            }
        },

        greetings(parent, args, ctr, info){
            if(args.name && args.position){
                return `Hello ${args.name}! I am a best ${args.position}`
            }
            else if(args.name){
                return `Hello ${args.name}!`
            }
            else if(args.position){
                return `Your position is ${args.position}`
            }
                return "Hello!"
            
        },
        me(){
            return{
                id: "12345",
                name: "Abnish",
                email: "akp12556@gmail.com",
                age: 24,
                name: "Alok"
            }
        },
        post(){
            return{
                id: "45678",
                title: "This is first Post",
                body: "About GraphQL",
                published: 2020
            }
        }
    }
} 

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(()=>{
    console.log(" The server is up!")
})




// const typeDefs =`
//     type Query{
//         id: ID!
//         name: String!
//         age: Int!
//         employed: Boolean!
//         gpa: Float!
      
//     }
// `

// const typeDefs = `
//     type Query{
//         title: String!
//         price: Float!
//         releasingYear: Int!
//         rating: Float
//         isStock: Boolean!
//     }
// `
// // Resolvers

// const resolvers = {
//     Query: {
//         id(){
//             return "abc123"
//         },
//         name(){
//             return "Abnish Kumar"
//         },
//         age(){
//             return 27
//         },
//         employed(){
//             return "Software Developer"
//         },
//         gpa(){
//             return 3.1
//         }
//     }
// }
