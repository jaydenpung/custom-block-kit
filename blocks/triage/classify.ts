import type { BackendCBK } from "../../base";
import type { Category, SelectedCategory } from "./types";

export async function categorizeInput(
  cbk: BackendCBK,
  categories: Category[],
  input: string,
  likelihoodThreshold: number,
  fallbackCategory: string
) {
  const categoriesFormatted = categories
    .map((category) => {
      return `- "${category.label}": ${category.description}`;
    })
    .join("\n");

  const prompt = `
    You are an AI that triages inbound requests. To get to the right outcome, you think through step by step the likelihood that a request falls within each of the provided categories and include your reasoning in your response. You only respond in the following JSON format - your response includes likelihoods for all categories provided below. Your response should be a single JSON array.\n
    {\n
    category:string,\n
    likelihood:float, // 2 dp\n
    reason: string // up to 200 characters\n
    }[]\n
    \n
    Categories (in format "label": description):\n
    ${categoriesFormatted}
    \n

    Request: "${input}"
    `;

  try {
    const data = {
      model: "gpt-3.5-turbo",
      temperature: 0,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    // This is called from apiClient so we have rate limiting and so openai key is not exposed
    const response = await cbk.apiClient.openai.completions(data);

    const responseJson = response.data;
    const output = responseJson.choices[0].message.content;
    const outputJson = JSON.parse(output);

    let highestLikelihoodCategory: SelectedCategory = {
      category: "",
      likelihood: 0,
      reason: "",
    };

    for (let i = 0; i < outputJson.length; i++) {
      const category = outputJson[i];
      if (
        category.likelihood > highestLikelihoodCategory.likelihood &&
        category.likelihood > likelihoodThreshold
      ) {
        highestLikelihoodCategory.likelihood = category.likelihood;
        highestLikelihoodCategory.category = category.category;
        highestLikelihoodCategory.reason = category.reason;
      }
    }

    // const outputCategory = highestLikelihoodCategory.category;
    // const outputReason = highestLikelihoodCategory.reason;

    var outputCategory = highestLikelihoodCategory;
    if (highestLikelihoodCategory.category === "") {
      outputCategory = {
        category: fallbackCategory,
        likelihood: 0,
        reason: "No category met the likelihood threshold",
      };
    }

    return outputCategory;
  } catch (error) {
    console.error("Error:", error);
  }
}