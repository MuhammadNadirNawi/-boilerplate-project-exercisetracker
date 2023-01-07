const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on('connected', () => {
  console.log('Mongoose is connected');
});

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended: false}))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});




const logSchema = new mongoose.Schema({
  description: {
    type: String,
    require: true,
  },
  duration: {
    type: Number,
    require: true
  },
  date: {
    type: String,
  },
  user: { type:  mongoose.Types.ObjectId, ref: 'Users' },

})

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  // log:[{ type:  mongoose.Types.ObjectId, ref: 'Logs' }]
  //   description: {
  //   type: String,
  // },
  // duration: {
  //   type: Number,
  // },
  // date: {
  //   type: String,
  // }
})

const Users = mongoose.model("Users", userSchema)
const Logs = mongoose.model("Logs", logSchema)

app.post("/api/users", (req, res) => {
  
  const name = req.body.username

  const newUser = new Users({
    username: name
  });

  newUser.save((err, user) => {
    if(err){
      res.json(err)
    }
    else(
      res.json({username: user.username, _id: user._id})
      // res.json(user)
    )
  })
 
})

app.get("/api/users", (req, res) => {
  Users.find((err, data) => {
    if (err){
      res.json(err)
    }
    else{
      // console.log(data.username)
      // res.json({username: data.username, _id: data._id})    
        res.json(data)
    }   

  })
})

app.post("/api/users/:id/exercises", (req, res)=> {

  // const id = req.body[":_id"]
  const id =   req.params.id 
  const desc = req.body.description
  const time = req.body.duration
  const dateString = req.body.date
  console.log(dateString)
  const date_ = new Date(dateString).toDateString();
  console.log(date_)
  const now = new Date();
  const dateNow = now.toISOString().slice(0, 10);
  // const date = new Date(dateString).toDateString
  // res.params.id = id
  // console.log(req.body.date == true)
  if (req.body.date && req.body.date.length > 0) {
  //   Users.findByIdAndUpdate({_id: id}, {description: desc, duration: time, date: date}, {new: true}, (err, data) => {
  //     if(err){
  //       res.json(err)
  //     }
  //     else(
  //       res.json({_id: data._id, username: data.username, date: data.date, duration: data.duration, description: data.description})
  //     )
  //  })
    // Users.findById({_id: id}, (err, user) => {
    //   if (err) {
    //     res.json(err)
    //   }
    //   else {
    //     // const user = user.username
    //     // console.log(user.username)
        
    //   }
    // })
    // const name = user.username

    Users.findById({_id: id}, (err, user) => {
      if (err) return handleError(err);
      console.log(user)
      // Create a new task
      // const task = new Task({ name: 'My task', done: false });
      const newLog = new Logs({
        description: desc,
        duration: time,
        date: dateString,
        user: user._id
      })
    
      newLog.save((err,log) => {
        if (err){
          res.json(err)
        }
        else{
          res.json({username: user.username, description: log.description, duration: log.duration, date: new Date(log.date).toDateString(), _id: user._id})

          // user.log.push(log);
          // user.save((err) => {
          //   if (err) return handleError(err);
          // });
        }
      })
    
      // Add the task to the user's tasks array
     
    
      // Save the user
    
    });

       
  }
  else{
  //    Users.findByIdAndUpdate({_id: id}, {description: desc, duration: time, date: dateNow}, {new: true}, (err, data) => {
  //     if(err){
  //       res.json(err)
  //     }
  //     else(
  //       res.json({_id: data._id, username: data.username, date: data.date, duration: data.duration, description: data.description})
  //     )
  //  })
  Users.findById({_id: id}, (err, user) => {
    if (err) return handleError(err);
    console.log(user)
    // Create a new task
    // const task = new Task({ name: 'My task', done: false });
    const newLog = new Logs({
      description: desc,
      duration: time,
      date: dateNow,
      user: user._id
    })
  
    newLog.save((err,log) => {
      if (err){
        res.json(err)
      }
      else{
        res.json({username: user.username, description: log.description, duration: log.duration, date: new Date(log.date).toDateString(), _id: user._id})

        // user.log.push(log);
        // user.save((err) => {
        //   if (err) return handleError(err);
        // });
      }
    })
  
    // Add the task to the user's tasks array
   
  
    // Save the user
  
  });
  }

 
})

app.get("/api/users/:id/logs", (req, res) => {
  const id = req.params.id
  const {from, to, limit} = req.query
  console.log(from)
  // const fromDate = new Date(from).toDateString();
  // const toDate = new Date(to).toDateString();
  // console.log(fromDate)
  console.log(Object.keys(req.query).length)
  console.log(id)
  if(Object.keys(req.query).length == 0) {
    Users.findById({_id: id,}, (err, user) => {
      if (err) {
        res.json(err)
      }
      // Logs.find({user: id}, (err, log) => {
      //   if(err) {
      //     res.json(err)
      //   }
      //   else{
      //     // res.json({
      //     //   username: user.username,
      //     //   _id: user._id,
      //     //   log: [{
      //     //     description: log.description,
      //     //     duration: log.duration,
      //     //     date: log.date
      //     //   }]
      //     // })
      //     res.json(log)
      //   }
      // })
      Logs.find({user: id,}).select({user: 0, _id: 0, __v:0}).exec((err, log) => {
        if(err) {
          res.json(err)
        }
        else {
          res.json({
            username: user.username,
            count: log.length,
            _id: user._id,
            log: log
          })
        }
      })
    })
  }
  else {
    Users.findById({_id: id,}, (err, user) => {
      if (err) {
        res.json(err)
      }
      // Logs.find({user: id}, (err, log) => {
      //   if(err) {
      //     res.json(err)
      //   }
      //   else{
      //     // res.json({
      //     //   username: user.username,
      //     //   _id: user._id,
      //     //   log: [{
      //     //     description: log.description,
      //     //     duration: log.duration,
      //     //     date: log.date
      //     //   }]
      //     // })
      //     res.json(log)
      //   }
      // })
      Logs.find({user: id, date: { $gte: from, $lt: to }}).select({user: 0, _id: 0, __v:0}).exec((err, log) => {
        if(err) {
          res.json(err)
        }
        else {
          res.json({
            username: user.username,
            count: log.length,
            _id: user._id,
            log: log
          })
        }
      })
    })

  }
 })

 

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
