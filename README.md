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
  allPosts {
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
    tags {  
      id  
      name  
    }  
  }  
}
```

post columns are explained in src/data/schema
