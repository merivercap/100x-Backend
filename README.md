# 100x-Backend
100x Blog Platform Backend

### Install

```shell
$ yarn install
```

### Start Server
```shell
$ nodemon
```

### Mock Data

Navigate to ```localhost:3000/graphiql ``` </br></br>
Example Query

```  
query {  
  getAllPosts {
    id  
    author  
    permlink  
    title  
    body  
    net_votes  
    children  
    curator_payout_value  
    trending
    post_type  
    tag1
    tag2
    tag3
    tag4
    tag5
  }  
}
```

Example getPostReplies query

```
// get specific post content such as replies and upvote/downvote information with

{
  getPostReplies(message: "get_content_replies", params: [["steemit", "firstpost"]])
}
```

post columns are explained in src/data/schema
