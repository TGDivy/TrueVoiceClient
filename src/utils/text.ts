export const formatText = (text: string) => {
  const camelCaseRegex = /((?<=\p{Ll})\p{Lu})/gu;
  const snakeCaseRegex = /(_)/g;
  const dotRegex = /(\.)/g;
  const dashRegex = /(-)/g;
  return text
    .replace(camelCaseRegex, " $1")
    .replace(snakeCaseRegex, " ")
    .replace(dotRegex, " ")
    .replace(dashRegex, " ")
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
};

// function to recurse through an object/ array and change all date strings to date objects
export const convertDateStringsToDates = (input: unknown): unknown => {
  if (typeof input !== "object") {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map((value) => convertDateStringsToDates(value));
  }

  if (input === null) {
    return input;
  }

  return Object.keys(input as Record<string, unknown>).reduce(
    (obj: Record<string, unknown>, key: string) => {
      obj[key] = convertDateStringsToDates(
        (input as Record<string, unknown>)[key]
      );
      if (
        key.toLowerCase().includes("date") ||
        (key === "updatedAt" && typeof obj[key] === "string") ||
        (key === "createdAt" && typeof obj[key] === "string") ||
        (key === "completedAt" && typeof obj[key] === "string") ||
        (key === "dueDate" && typeof obj[key] === "string") ||
        (key.toLowerCase().includes("time") && typeof obj[key] === "string")
      ) {
        obj[key] = obj[key] && new Date(obj[key] as string);
      }
      return obj;
    },
    {}
  );
};

export const timeElapsed = (startTime: Date) => {
  return Math.ceil((new Date().getTime() - startTime.getTime()) / 1000);
};

// in seconds by default, or in milliseconds if specified
export const formatTime = (
  time: number,
  inMilliseconds = false,
  showHours = true,
  showMinutes = true,
  showSeconds = true
) => {
  const seconds = inMilliseconds ? time / 1000 : time;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  let displaySeconds = remainingSeconds.toString();
  if (remainingSeconds < 10) {
    displaySeconds = `0${displaySeconds}`;
  }

  let displayMinutes = minutes.toString();
  if (minutes < 10) {
    displayMinutes = `0${displayMinutes}`;
  }

  let buildString = "";
  if (showHours) {
    buildString += `${hours}`;
  }
  if (showMinutes) {
    if (showHours) {
      buildString += ":";
    }
    buildString += `${displayMinutes}`;
  }
  if (showSeconds) {
    if (showMinutes || showHours) {
      buildString += ":";
    }
    buildString += `${displaySeconds}`;
  }

  return buildString;
};
