const express = require("express");
const router = express.Router();
const storyController = require("../controller/story");
const { verifyToken } = require("../middlewares/verifyToken");


router.post("/slides", storyController.createSlides);
router.post("/stories",verifyToken, storyController.createStory);
router.get("/story-details/:storyId",storyController.getStoryDetailsById);
router.get("/all",storyController.getAllStories);
router.post("/update/:storyId", storyController.updateStory);
module.exports = router;      