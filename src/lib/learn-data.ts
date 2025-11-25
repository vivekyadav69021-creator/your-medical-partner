
export type LearnCollectionItem = {
    id: string;
    title: string;
    summary: string;
    chapters: {
        id: string;
        title: string;
        summary: string;
        full_text?: string;
    }[];
}


export const learnCollectionsData: LearnCollectionItem[] = [
    {
        id: 'patanjali_overview',
        title: 'Patanjali Yoga-Sutras',
        summary: "Patanjali's Yoga-Sutras present an 8-limb (Ashtanga) system: Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, Samadhi. Practicing these systematically leads to mental clarity and liberation.",
        chapters: [
            {
                id: 'samadhi_pada',
                title: 'Chapter 1: Samadhi Pada',
                summary: 'Explains the nature of mind, the goal of yoga (cessation of fluctuations) and the methods to reach samadhi.',
                full_text: `
                    <p><strong>1.1 Atha yoganusasanam</strong><br/>Now, the exposition of Yoga.</p>
                    <p><strong>1.2 Yogas citta-vrtti-nirodhah</strong><br/>Yoga is the stilling of the changing states of the mind.</p>
                    <p><strong>1.3 Tada drastuh svarupe-vasthanam</strong><br/>When that is accomplished, the seer abides in its own true nature.</p>
                    <p><strong>1.4 Vrtti-sarupyam itaratra</strong><br/>At other times, the seer identifies with the fluctuating states of the mind.</p>
                `
            },
            {
                id: 'sadhana_pada',
                title: 'Chapter 2: Sadhana Pada',
                summary: 'Describes the practical path of yoga, including Kriya Yoga and the eight limbs (Ashtanga Yoga).',
                full_text: '<p>Content for Sadhana Pada coming soon.</p>'
            },
        ]
    },
    {
        id: 'gita_overview',
        title: 'Bhagavad Gita',
        summary: 'The Bhagavad Gita emphasizes action with detachment (karma-yoga), devotion (bhakti) and knowledge (jnana). Its teachings complement meditation by providing ethical and motivational context.',
        chapters: [
            {
                id: 'gita_ch1',
                title: 'Chapter 1: Arjuna’s Despondency',
                summary: 'Arjuna\'s dilemma on the battlefield.',
                full_text: '<p>Content for Gita Chapter 1 coming soon.</p>'
            }
        ]
    }
]
