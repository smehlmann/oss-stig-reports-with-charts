import React, { useEffect, useState } from 'react'
import { useAuth } from 'oidc-react'

// example code displaying how our access token config will work and flow 
function UseMyAuth() {

  console.log('UseMyAuth calling authenticator');

  try {
    // calling authenicator
    const auth = useAuth()

    return auth;
  }
  catch (e) {
    console.log(e.message);
  }

}

export { UseMyAuth };
