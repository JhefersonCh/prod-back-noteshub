const { User, RefreshToken } = require("../models/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

exports.login = async (req, res) => {
  
  try {
    const { email, password } = req.body;

    console.log( req.body );

    if(!email || !password){
      return res.status(400).json({
        error: 'Email and password are required.'
      })
    }

    const userExist = await User.findOne({ where: { email } });

    if(!userExist){
      return res.status(400).json({
				error: "This email does not exist.",
			});
    }
    const passwordIsValid = await bcrypt.compare(password, userExist.password)

    if(!passwordIsValid){
      return res.status(400).json({
				error: "The password is invalid.",
			});
    }

    const token = jwt.sign(
      {
       id: userExist.id, email: userExist.email 
      },
      process.env.JWT_SECRET,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: process.env.JWT_EXPIRATION,
      }
    )

    const _token = uuidv4();
    let expireAt = new Date();

	  expireAt.setTime(expireAt.getTime() + process.env.REFRESH_EXPIRATION * 1000);

    const refreshToken = jwt.sign(
      {
       id: userExist.id, email: userExist.email, uniqueId: _token
      },
      process.env.REFRESH_SECRET,
      {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: parseInt(process.env.REFRESH_EXPIRATION),
      }
    )

    await RefreshToken.create({
      token: refreshToken,
      userId: userExist.id,
      expiration: expireAt.getTime()
    })

    return res.status(200).json({
      message: 'Sign in successfully.',
      data: {
        user: {
          id: userExist.id,
          email: userExist.email,
          accessToken: token,
          refreshToken: refreshToken
        }
      }
    })
    
  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error.'
    })
  }
}

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(404).json({
        message: "Refresh token is required",
      });
    }

    const tokenExist = await RefreshToken.findOne({
			where: { token: refreshToken },
		});

    if(!tokenExist){
      return res.status(404).json({
				message: "Refresh Token does not exist.",
			});
    }

    if(RefreshToken.verifyExpiration(tokenExist)){
      await RefreshToken.destroy({ where: { id: tokenExist.id } });
      return res.status(403).json({
				message: "Refresh token was expired. Please make a new signin request.",
			});
    }

    const user = await tokenExist.getUser();

    if(!user){
      return res.status(404).json({
				message: "The user id is not valid for this token.",
			});
    }

    const newToken = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
			algorithm: "HS256",
			allowInsecureKeySizes: true,
			expiresIn: process.env.JWT_EXPIRATION,
		});

    return res.status(200).json({
      message: 'Token refresh successful.',
      data: {
        user: {
          id: user.id,
          email: user.email,
          accessToken: newToken,
          refreshToken: tokenExist.token
        }
      }
    });

  } catch (error) {
    return res.status(500).json({
      error: 'Internal server error.'
    })
  }
}