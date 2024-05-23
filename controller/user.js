const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

const registerUser = async (req, res) => {
    try {
      const { username, password } = req.body;
  
      if (!username|| !password) {
        return res.status(400).json({
          errorMessage: "Bad request",
        });
      }
      const isExistingUser = await User.findOne({ username: username });
      if (isExistingUser) {
        return res.status(409).json({ errorMessage: "User already exists" });
      }

      const hashedpassword = await bcrypt.hash(password, 10);

      const userData = new User({
        username,
        password: hashedpassword,
        
      });

      await userData.save();
      res.json({
        message: "User reistered successfully",
      });
    } catch (error) {
        console.log(error);
        res.status(500).json({ errorMessage: "Something went wrong!" });
      }
    };

    const loginUser = async (req, res) => {
        try {
          const { username, password } = req.body;
         
          if ( !username || !password) {
            return res.status(400).json({
              errorMessage: "Bad request",
            });
          }

          const userDetails = await User.findOne({username});  
      if(!userDetails) {
      return res 
           .status(401)
           .json({ errorMessage: "User doesn't exist"});
    }
 
    const passwordMatch = await bcrypt.compare(password, userDetails.password)

    if(!passwordMatch){
        return res 
            .status(401)
            .json({ errorMessage: "Invalid credentials"})
       }



       const token = jwt.sign({ userId: userDetails._id, name: userDetails.username }, process.env.SECRET_CODE || "Sw!ptory",{expiresIn: "30m"});
       res.json({message: "User Logged in",token,username: userDetails.username,userId: userDetails._id });
     } catch (error) {
       console.log(error);
       res.status(401).json({ errorMessage: "Something went wrong!" });
     }
   };

   module.exports = { registerUser, loginUser };
   