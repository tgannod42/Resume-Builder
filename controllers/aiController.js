const suggestResponsibility = async (objReq, objRes) => {
    try {
        const { text: strText, geminiKey: strGeminiKey } = objReq.body;
        if (!strText || !strGeminiKey) {
            return objRes.status(400).json({ error: 'text and geminiKey are required.' });
        }

        const strImprovedText = `Led initiatives to ${strText.trim().replace(/\.$/, '')}, improving delivery quality and measurable outcomes.`;

        return objRes.status(200).json({ originalText: strText, aiText: strImprovedText });
    } catch (objError) {
        return objRes.status(500).json({ error: 'Failed to generate AI suggestion.', details: objError.message });
    }
};

module.exports = {
    suggestResponsibility
};
