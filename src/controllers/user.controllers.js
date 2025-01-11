import { asyncHandler } from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/apiResponse.js";



const registerUser = asyncHandler(async (req, res) => {
  //   1; // get user details from frontend
  //   2; // validation - not empity
  //   3; // check if user already exists
  //   4; // check for images, check for avatar
  //   5; // upload them to cloudinary, avatar
  //   6; // create user object - create entry in DB
  //   7; // remove password and refresh token filed from response
  //   8; // check for user creation
  //   9; // return res

  //1 user?
  const { fullname, email, username, password } = req.body;
  console.log("email", email);
  //2 validation?
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  //3 User existed?
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with email and username existed");
  }

  //4 check images?
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  //5 uload cloudinary?
  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(avatarLocalPath);

  if (!avatar) {
    throw new ApiError(400, "Avatar is required");
  }

  //   6; // create user object - create entry in DB
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),

  });

  //   7; // remove password and refresh token filed from response

  const craetedUser = await User.findById(user._id).select(
   "-password -refreshToken"
)


  //   8; // check for user creation

if(!craetedUser){
   throw new ApiError(500, "Something went wrong while registering the user")

}


  //   9; // return res

return res.status(201).json(
   new ApiResponse(200, craetedUser, "User registered seccessfully")
)

});


export { registerUser };
