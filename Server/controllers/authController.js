const { promisify } = require("util");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const AppError = require("./../Utils/appError");
const catchAsync = require("./../Utils/catchAsync");
const User = require("../models/userModel");

const client = new OAuth2Client(process.env.CLIENT_ID);

const checkOrg = (email) => {
  const index = email.indexOf("@");
  const domain = email.substr(index);
  if (domain !== "@iitbbs.ac.in") return true;
  return true;
};

const createToken = (id, role) => {
  const jwtToken = jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  return jwtToken;
};

const createSendToken = (user, statusCode, res) => {
  try {
    const token = createToken(user._id, user.role);
    const expireAt = new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    );
    const cookieOptions = {
      Expires: new Date(
          Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000
      ),
      httpOnly: true
  }

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    res.cookie("jwt", token, cookieOptions);
    res.status(statusCode).json({
      status: "success",
      user,
      jwt: token
    });
  } catch (error) {
    throw new AppError(error.message, 500);
  }
};

exports.verifyJwtToken = catchAsync(async (req, res, next) => {
  // 1) Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }
  // 2) Verifying token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  req.jwtPayload = {
    id: decoded.id,
    role: decoded.role,
  };
  next();
});

exports.loggedInUser = catchAsync(async (req, res, next) => {
  const currentUser = await User.findById(req.jwtPayload.id);
  if (!currentUser) {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist.",
        401
      )
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.jwtPayload.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};

exports.restrictToIITBBS = (req, res, next) => {
  if (checkOrg(req.user.email)) {
    return next(new AppError("Restrcited to IITBBS email IDs", 403));
  }
  next();
};

exports.googleLogin = catchAsync(async (req, res, next) => {
  const { tokenId } = req.body;
  if (!tokenId) {
    return next(new AppError("User not logged in.", 403));
  }

  const response = await client.verifyIdToken({
    idToken: tokenId,
    audience: process.env.CLIENT_ID,
  });
  const { name, email, picture } = response.payload;
  const user = await User.findOne({ email });
  const length = 6;
  if (user) {
    createSendToken(user, 200, res);
  } else {
    const RandNum = Math.floor(
      Math.pow(10, length - 1) +
        Math.random() * (Math.pow(10, length) - Math.pow(10, length - 1) - 1)
    );

    const newUser = await User.create(
      [
        {
          name,
          email,
          image: picture
        },
      ],
      { validateBeforeSave: false }
    );
    createSendToken(newUser[0], 201, res);
  }
});

exports.logout = (req, res, next) => {
  res.clearCookie("jwt", {
    path: "/",
  });
  res.status(200).json({
    status: "success",
    message: "logged out",
  });
};

exports.loginStatus = (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "logged in",
    user: req.user,
  });
};