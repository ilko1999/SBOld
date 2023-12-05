const REGEX_PATTERNS = {
  email: new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/),
};

const isValidEmail = (email: string): boolean => {
  console.log(email);
  console.log(REGEX_PATTERNS.email.test(email));
  return REGEX_PATTERNS.email.test(email);
};

function isImgUrl(url: string) {
  return /\.(jpg|jpeg|png|webp|avif|gif)$/.test(url);
}

export { isValidEmail, isImgUrl };
