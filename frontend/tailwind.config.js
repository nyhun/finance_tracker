import { materialTailwindConfig } from "@material-tailwind/react/utils";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
    ...materialTailwindConfig.content,
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};