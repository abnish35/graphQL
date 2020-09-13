import { GraphQLServer } from 'graphql-yoga';

// Type definition (schema)
// Scalar Type or Data type in GraphQL 
// String , Boolean, Int, Float, ID

// Non Scalar Type
// Object and Array

// At the end of eact data type, there is "!" mark, that show that This type will return someting other than null. if you donot put "!" at the end of data type, it will give "null" value to it.

// create a user data
const users = [
    { id: "1", name: "Abnish", email: "abnish@example.com", age: 26 },
    { id: "2", name: "Alok", email: "alok@example.com" },
    { id: "3", name: "Rahul", email: "rahul@example.com", age: 24 }
]

const posts =[
    { id: "123", title: "GraphQL learning", body: "Best way to learn it", published: false, author: "1" },

    { id: "157", title: "A way to learn", body: "Fantastic GraphQL Book Every one should read", published: true, author: "1" },

    { id: "234", title: "A full stack developer", body: "Become a MERN Stack Developer", published: true, author: "2" }
]

const typeDefs = `
    type Query{
        users(query: String): [User!]! 
        posts(query: String): [Post]!
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
        published: Boolean!
        author: User!
    }
`
const resolvers = {
    Query:{

        posts(parent, args, ctx, info){
            if(!args.query){
                return posts
            }
            return posts.filter(post=> {

                const isTitleMatch = post.title.toLowerCase().includes(args.query.toLowerCase())
                const isBodyMatch = post.body.toLowerCase().includes(args.query.toLowerCase())
                
                return isTitleMatch || isBodyMatch
             })},

        users(parent, args, ctx, info){
            if(!args.query){
                return users
            }

            return users.filter(user=> user.name.toLocaleLowerCase().includes(args.query.toLowerCase())
            )
        },
    },
    Post: {
        author(parent, args, ctx, info){
            console.log(parent)
            return users.find((user)=>  {
            return user.id === parent.author})
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


// IF you donot pass agruments and want to return an array, you can write code in this manner. 

// type Query{
//     users: [User!]! }

// inside resolver 
//   users(){
//     return users
// },

// If you want to access these array data, write code in this manner in playground; 

// query{
	// users{
    //     id
    //     name
    //     age
    //     email
    //   } }


    // me(){
    //     return{
    //         id: "12345",
    //         name: "Abnish",
    //         email: "akp12556@gmail.com",
    //         age: 24,
    //         name: "Alok"
    //     }
    // },
    // post(){
    //     return{
    //         id: "45678",
    //         title: "This is first Post",
    //         body: "About GraphQL",
    //         published: false
    //     }
    // }




// const typeDefs =`
//     type Query{
//         id: ID!
//         name: String!
//         age: Int!
//         employed: Boolean!
//         gpa: Float!
      
//     }
// `

// Array type 

// type Query{
//     greetings(name: String, position: String): String!
//     addValue(v1: Float!, v2: Float!): String!
//     addNumber(count: [Float!]!): Float!
//     grades: [Int!]!
//     me: User!
//     post: Post!
// }

// Array Resolvers

// addValue(parent, args, ctr, info){
//     if(args.v1 && args.v2){
//         return  `Sum is ${args.v1}` + `${args.v2}`
//     }
//     else if(args){
//         return args
//     }
// },

// // passed array as a arguments

// addNumber(arparent, args, ctr, infogs){
//     if(args.count.length === 0){
//         return 0
//     }

//     return args.count.reduce((accumulator, currentValue)=>{
//         return accumulator + currentValue
//     })
// },

// // returm array
// grades(){
//     return [1,2,3]
// },

// greetings(parent, args, ctr, info){
//     if(args.name && args.position){
//         return `Hello ${args.name}! I am a best ${args.position}`
//     }
//     else if(args.name){
//         return `Hello ${args.name}!`
//     }
//     else if(args.position){
//         return `Your position is ${args.position}`
//     }
//         return "Hello!"
    
// },


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
