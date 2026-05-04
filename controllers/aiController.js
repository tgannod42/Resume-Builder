const { GoogleGenerativeAI } = require('@google/generative-ai');

const buildSuggestionPrompt = (strSectionType, strText) => {
    const strNormalizedSection = (strSectionType || 'responsibility').trim().toLowerCase();

    return [
        'You are a resume writing assistant.',
        `Rewrite the following ${strNormalizedSection} text to be concise, professional, and impact-focused.`,
        'Return only the rewritten text with no preamble and no markdown.',
        `Input: ${strText}`
    ].join('\n');
};

const suggestResponsibility = async (objReq, objRes) => {
    try {
        const { text: strText, geminiKey: strGeminiKey, sectionType: strSectionType } = objReq.body;
        if (!strText || !strGeminiKey) {
            return objRes.status(400).json({ error: 'text and geminiKey are required.' });
        }

        const objGenAi = new GoogleGenerativeAI(strGeminiKey.trim());
        const objModel = objGenAi.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const strPrompt = buildSuggestionPrompt(strSectionType, strText.trim());
        const objGenerationResult = await objModel.generateContent(strPrompt);
        const strImprovedText = (objGenerationResult.response.text() || '').trim();

        if (!strImprovedText) {
            return objRes.status(502).json({ error: 'Gemini returned an empty suggestion.' });
        }

        return objRes.status(200).json({ originalText: strText, aiText: strImprovedText });
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to generate AI suggestion.', details: objError.message });
    }
};

module.exports = {
    suggestResponsibility
};
