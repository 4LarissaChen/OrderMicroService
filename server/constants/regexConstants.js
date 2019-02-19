'use strict';

// regular expression for any `id` property
// must start with a letter or number, contain no special characters, and require length to be less than 64
exports.REGEX_VALID_NAMING = /^[a-zA-Z0-9][a-zA-Z0-9-._,'" @]{0,63}$/;

