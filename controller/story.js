const Slide = require("../models/story");
const Story = require("../models/story");
const { decodeJwtToken } = require("../middlewares/verifyToken");

const createSlides = async (req, res) => {
  try {
    const { heading, description, image, category } = req.body;
    if (!heading || !description || !image || !category) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }
    const slideDetails = new Slide({
      heading,
      description,
      image,
      category,
    });
    await slideDetails.save();
    res
      .status(201)
      .json({ message: "Slide added successfully", slide: slideDetails });
  } catch (error) {
    next(error); 
  }
};

const createStory = async (req, res, next) => {
  try {
    const { slides } = req.body;
    if (!slides) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    const userId = req.userId;
    const newStory = new Story({ slides, refUserId: userId });
    await newStory.save();
    res
      .status(201)
      .json({ message: "Story added successfully", story: newStory });
  } catch (error) {
    next(error);  
  }   
};


const getStoryDetailsById = async (req,res,next) => {
 try {
  const storyId = req.params.storyId;
  const userId = decodeJwtToken(req.headers["authorization"]);
  
  const storyDetails = await Story.findById(storyId);
  if(!storyDetails){
    return res.status(400).json({
      errorMessage: "Bad request"
    });
  }
 let isEditable;
 if(userId) {
  if(storyDetails.refUserId.equals(userId)){
    isEditable = true; 
  }
 }
res.json({storyDetails,isEditable});
 } catch (error) {
  next(error);
 }
};

const getAllStories = async (req, res, next) => {
  try {
    const category = req.query.category || "";
    // console.log(category);
    const userId = decodeJwtToken(req.headers["authorization"]);
    // console.log(userId);
    // Fetch all stories from the database
    const stories = await Story.find(
    {   'slides.category': { $regex: new RegExp(category, "i") } }
    );
   let isEditable = false;
    const storiesWith = stories.map((story) => {
      return { story, isEditable };
    }) 
    if (!userId) {
    res.json({ stories,stories: storiesWith });
      return res.status(403).json({
        errorMessage: "Unauthorized access",
      }); 
    }
    
    // Iterate through each story and check if it's editable
   const storiesWithEditability = stories.map((story) => {
      isEditable = false;
      if (story.refUserId && story.refUserId.toString() === userId.toString()) {
        isEditable = true;
      }
      return { story, isEditable };
    });
    res.json({ stories,stories: storiesWithEditability });
  } catch (error) {  
    next(error); 
  }
}; 

const updateStory = async (req, res, next) => {
  try {
    const { storyId } = req.params;
    const userId = decodeJwtToken(req.headers["authorization"]);
    const { slides } = req.body;

    if (!storyId || !userId) {
      return res.status(400).json({
        errorMessage: "Bad request",
      });
    }

    const existingStory = await Story.findById(storyId);
    if (!existingStory) {
      return res.status(404).json({
        errorMessage: "Story not found",
      });
    }

    if (!existingStory.refUserId.equals(userId)) {
      return res.status(403).json({
        errorMessage: "Unauthorized access",
      });
    }

    existingStory.slides = slides;
    await existingStory.save();

    res.status(200).json({
      message: "Story updated successfully",
      story: existingStory,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createSlides, 
  createStory,
  getStoryDetailsById, 
  getAllStories, 
  updateStory
};

   