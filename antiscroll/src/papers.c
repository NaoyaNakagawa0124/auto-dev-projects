#include "papers.h"
#include "raylib.h"
#include <stddef.h>

PaperDB papers_init(void)
{
    PaperDB db = {0};
    int i = 0;

    /* Machine Learning */
    db.papers[i++] = (Paper){"Attention Is All You Need: Revisited", "cs.LG"};
    db.papers[i++] = (Paper){"Scaling Laws for Neural Language Models", "cs.LG"};
    db.papers[i++] = (Paper){"Memory-Augmented Reinforcement Learning for Agents", "cs.LG"};
    db.papers[i++] = (Paper){"Efficient Fine-Tuning with Low-Rank Adaptation", "cs.LG"};
    db.papers[i++] = (Paper){"Graph Neural Networks for Molecular Discovery", "cs.LG"};
    db.papers[i++] = (Paper){"Self-Supervised Learning from Unlabeled Video", "cs.LG"};
    db.papers[i++] = (Paper){"Federated Learning at Scale: Practical Challenges", "cs.LG"};

    /* Natural Language Processing */
    db.papers[i++] = (Paper){"Chain-of-Thought Prompting for Complex Reasoning", "cs.CL"};
    db.papers[i++] = (Paper){"Multilingual Translation Without Parallel Data", "cs.CL"};
    db.papers[i++] = (Paper){"Retrieval-Augmented Generation for Knowledge Tasks", "cs.CL"};
    db.papers[i++] = (Paper){"Evaluating Hallucination in Large Language Models", "cs.CL"};
    db.papers[i++] = (Paper){"Instruction Tuning with Human Feedback", "cs.CL"};

    /* Computer Vision */
    db.papers[i++] = (Paper){"Diffusion Models Beat GANs on Image Synthesis", "cs.CV"};
    db.papers[i++] = (Paper){"Video Understanding with Sparse Attention", "cs.CV"};
    db.papers[i++] = (Paper){"3D Scene Reconstruction from Single Images", "cs.CV"};
    db.papers[i++] = (Paper){"Real-Time Object Detection on Edge Devices", "cs.CV"};
    db.papers[i++] = (Paper){"Medical Image Segmentation with Foundation Models", "cs.CV"};

    /* Artificial Intelligence */
    db.papers[i++] = (Paper){"Autonomous Agents with Tool Use Capabilities", "cs.AI"};
    db.papers[i++] = (Paper){"Safe Exploration in Reinforcement Learning", "cs.AI"};
    db.papers[i++] = (Paper){"Multi-Agent Cooperation in Complex Environments", "cs.AI"};
    db.papers[i++] = (Paper){"Planning with World Models for Robotics", "cs.AI"};
    db.papers[i++] = (Paper){"Constitutional AI: Training Helpful Assistants", "cs.AI"};

    /* Physics */
    db.papers[i++] = (Paper){"Quantum Error Correction with Surface Codes", "quant-ph"};
    db.papers[i++] = (Paper){"Dark Matter Candidates from Collider Data", "hep-ph"};
    db.papers[i++] = (Paper){"Gravitational Wave Detection at Higher Frequencies", "gr-qc"};
    db.papers[i++] = (Paper){"Topological Phases in Two-Dimensional Materials", "cond-mat"};

    /* Mathematics */
    db.papers[i++] = (Paper){"New Bounds on the Twin Prime Conjecture", "math.NT"};
    db.papers[i++] = (Paper){"Optimal Transport and Its Applications to ML", "math.OC"};
    db.papers[i++] = (Paper){"Geometric Deep Learning on Manifolds", "math.DG"};

    /* Biology / Bioinformatics */
    db.papers[i++] = (Paper){"AlphaFold3: Predicting Protein-Ligand Complexes", "q-bio"};
    db.papers[i++] = (Paper){"Single-Cell RNA Sequencing at Population Scale", "q-bio"};
    db.papers[i++] = (Paper){"CRISPR Delivery Mechanisms for In Vivo Editing", "q-bio"};

    /* Economics */
    db.papers[i++] = (Paper){"Algorithmic Pricing and Market Equilibrium", "econ.TH"};
    db.papers[i++] = (Paper){"Causal Inference in Observational Economic Data", "econ.EM"};

    /* Astrophysics */
    db.papers[i++] = (Paper){"Exoplanet Atmospheres from JWST Observations", "astro-ph"};
    db.papers[i++] = (Paper){"Fast Radio Burst Origins: A Unified Model", "astro-ph"};
    db.papers[i++] = (Paper){"Mapping Dark Energy with Supernova Surveys", "astro-ph"};

    /* Robotics */
    db.papers[i++] = (Paper){"Sim-to-Real Transfer for Legged Locomotion", "cs.RO"};
    db.papers[i++] = (Paper){"Language-Guided Robot Manipulation", "cs.RO"};
    db.papers[i++] = (Paper){"Tactile Sensing for Dexterous Grasping", "cs.RO"};

    /* Systems */
    db.papers[i++] = (Paper){"Serverless Computing: Performance at Scale", "cs.DC"};
    db.papers[i++] = (Paper){"Disaggregated Memory for Cloud Workloads", "cs.DC"};

    /* Security */
    db.papers[i++] = (Paper){"Adversarial Attacks on Neural Code Models", "cs.CR"};
    db.papers[i++] = (Paper){"Differential Privacy in Federated Systems", "cs.CR"};
    db.papers[i++] = (Paper){"Post-Quantum Cryptography Standardization", "cs.CR"};

    /* Climate / Environment */
    db.papers[i++] = (Paper){"ML for Weather Prediction at Global Scale", "physics.ao"};
    db.papers[i++] = (Paper){"Carbon Capture Optimization with Deep RL", "physics.ao"};

    /* Neuroscience */
    db.papers[i++] = (Paper){"Brain-Computer Interfaces with Transformer Models", "q-bio.NC"};
    db.papers[i++] = (Paper){"Neural Correlates of Decision-Making Under Risk", "q-bio.NC"};

    /* Education */
    db.papers[i++] = (Paper){"Adaptive Learning Systems with LLM Tutors", "cs.CY"};
    db.papers[i++] = (Paper){"Measuring Student Engagement in Online Courses", "cs.CY"};

    db.count = i;
    return db;
}

const Paper *papers_random(const PaperDB *db)
{
    if (db->count == 0) return NULL;
    return &db->papers[GetRandomValue(0, db->count - 1)];
}

const Paper *papers_get(const PaperDB *db, int index)
{
    if (index < 0 || index >= db->count) return NULL;
    return &db->papers[index];
}
