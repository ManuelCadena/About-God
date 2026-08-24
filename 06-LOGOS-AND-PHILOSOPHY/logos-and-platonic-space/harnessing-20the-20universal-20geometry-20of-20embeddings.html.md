---
source_file: Harnessing_20the_20Universal_20Geometry_20of_20Embeddings.html.pdf
source_format: pdf
converted_at: 2026-08-23T22:24:40.233211
---

                Back to arXiv




                Back to arXiv

This is experimental HTML to improve accessibility. We invite you to report rendering errors. Use Alt+Y to toggle on
accessible reporting links and Alt+Shift+Y to toggle off. Learn more about this project and help improve conversions.

Why HTML? Report Issue Back to Abstract Download PDF

Table of Contents

  1. Abstract
  2. 1 Introduction
  3. 2 Problem formulation: unsupervised embedding translation
  4. 3 Our method: vec2vec
      1. 3.1 Architecture
      2. 3.2 Optimization
  5. 4 Experimental setup
      1. 4.1 Preliminaries
      2. 4.2 Evaluating translation
      3. 4.3 Evaluating information extraction
  6. 5 vec2vec learns to translate embeddings without any paired data
  7. 6 Using vec2vec translations to extract information
  8. 7 Ablations
  9. 8 Related work
10. 9 Discussion and Future Work
 11. A Compute
12. B Oracle-aided optimal transport baseline
13. C Translating to and from Qwen
14. D Text-image retrieval on MS COCO
15. E Initialization robustness by model backbone
16. F Full out-of-distribution translation results
17. G Zero-shot inversion on TweetTopic
18. H Prompt for measuring information extraction
19. References



HTML conversions sometimes display errors due to content that did not convert correctly from the source. This paper
uses the following packages that are not yet supported by the HTML conversion tool. Feedback on these issues are
not necessary; they are known and are being worked on.

    failed: biblatex.sty

Authors: achieve the best HTML results from your LaTeX submissions by following these best practices.

License: CC BY 4.0
arXiv:2505.12540v4 [cs.LG] 26 Jan 2026

Harnessing the Universal Geometry of Embeddings
Rishi Jha    Collin Zhang      Vitaly Shmatikov       John X. Morris
Department of Computer Science
Cornell University
Abstract
We introduce the first method for translating text embeddings from one vector space to another without any paired
data, encoders, or predefined sets of matches. Our unsupervised approach translates any embedding to and from a
universal latent representation (i.e., a universal semantic structure conjectured by the Platonic Representation
Hypothesis). Our translations achieve high cosine similarity across model pairs with different architectures, parameter
counts, and training datasets.

The ability to translate unknown embeddings into a different space while preserving their geometry has serious
implications for security. An adversary with access to a database of only embedding vectors can extract sensitive
information about underlying documents, sufficient for classification and attribute inference.

  Refer to caption




Figure 1: Left: input embeddings from different model families (T5-based GTR [undefat] and BERT-based GTE [undefae]) are
fundamentally incomparable. Right: given unpaired embedding samples from different models on different texts, our model learns
a latent representation where they are closely aligned.

  Refer to caption




Figure 2: Given only a vector database from an unknown model, vec2vec translates the database into the space of a known model
using latent structure alone. Converted embeddings reveal sensitive information about the original documents, such as the topic of
an email (pictured, real example).


1 Introduction
Text embeddings are the backbone of modern NLP, powering tasks like retrieval, RAG, classification, and clustering.
There are many embedding models trained on different datasets, data shufflings, and initializations. An embedding of
a text encodes its semantics: a good model maps texts with similar semantics to vectors close to each other in the
embedding space. Since semantics is a property of text, different embeddings of the same text should encode the
same semantics. In practice, however, different models encode texts into completely different and incompatible vector
spaces.

The Platonic Representation Hypothesis [undefq] conjectures that all vision models of sufficient size converge to the
same latent representation. We propose a stronger, constructive version of this hypothesis for text models: the
universal latent structure of text representations can be learned and, furthermore, harnessed to translate
representations from one space to another without any paired data or encoders.

In this work, we show that the Strong Platonic Representation Hypothesis holds in practice. Given unpaired examples
of embeddings from two models with different architectures and training data, our method learns a latent
representation in which the embeddings are almost identical (Figure˜1).

We draw inspiration from research on aligning word embeddings across languages [undefaai, undefi, undefn, undefh]
and unsupervised image translation [undefai, undefaaq]. Our vec2vec method uses adversarial losses and cycle
consistency to learn to encode embeddings into a shared latent space and decode with minimal loss. This makes
unsupervised translation possible. We use a basic adversarial approach with vector space preservation [undefas] to
learn a mapping from an unknown embedding distribution to a known one.

vec2vec is the first method to successfully translate embeddings from the space of one model to another without
paired data.111Prior work has successfully translated word embeddings between languages, typically relying on
overlapping vocabularies across languages. In contrast, we translate embeddings of entire sequences between
model spaces. vec2vec translations achieve cosine similarity as high as 0.96 to the ground-truth vectors in their target
embedding spaces and perfect matching on over 8000 shuffled embeddings (without access to the set of possible
matches in advance).

To show that our translations preserve not only the relative geometry of embeddings but also the semantics of
underlying inputs, we extract information from them using zero-shot attribute inference and inversion, without any
knowledge of the model that produced the original embeddings.222Our code is available on GitHub.


2 Problem formulation: unsupervised embedding translation
Consider a collection of embedding vectors {𝑢1 , …​𝑢𝑛 }, for example, a dump of a compromised vector database,
where each 𝑢𝑖 = 𝑀1 ​(𝑑𝑖 ) is generated by an unknown encoder 𝑀1 : 𝕍𝑠 → ℝ𝑑𝑀 from an unknown document 𝑑𝑖 . We
                                                                              1



cannot make queries to 𝑀1 and do not know its training data, nor architectural details. Our goal is to extract any
information about the documents 𝑑𝑖 .

  Refer to caption
Figure 3: Unsupervised embedding translation. With access to only 𝑢𝑖 = 𝑀1 (𝑑𝑖 ), vec2vec seeks to generate a translation 𝐹(𝑢𝑖 ) that is
close in 𝑀2 ’s embedding space to the ideal embedding 𝑣𝑖 = 𝑀2 ​(𝑑𝑖 ) without access to 𝑑𝑖 , 𝑣𝑖 , or 𝑀1 .

We do assume access to a different encoder 𝑀2 that we can query at will to generate new embeddings in some other
space. We also assume high-level distributional knowledge about the hidden documents: their modality (text) and
language (e.g., English). To extract information, we may translate {𝑢1 , …​𝑢𝑛 } into the output space of 𝑀2 and apply
techniques like inversion that require the encoder.

Limitations of correspondence methods. There is significant prior research on the problem of matching or
correspondence between sets of embedding vectors [undef, undefav, undefg, undefaaa]. These methods typically
assume that the two (or more) sets of embeddings are generated by different encoders on the same or highly-
overlapping inputs. In other words, for each unknown vector, there must already exist a set of candidate vectors in a
different embedding. In practice, it is unrealistic to expect that such a database be available, so these methods are not
directly applicable. Some matching methods, however, support translation between embedding spaces without
overlapping inputs. Our experiments demonstrate that these methods struggle significantly, even when
correspondence exists.

Our task is inherently more challenging than matching, because we do not assume access to encoder 𝑀1 , nor do we
have additional representations of documents 𝑑1 , …, 𝑑𝑛 beyond their embeddings 𝑢𝑖 = 𝑀1 ​(𝑑𝑖 ). Therefore, we rely
solely on unsupervised translation from 𝑀1 to 𝑀2 . The effectiveness of such unsupervised translation approaches
thus critically depends on identifying and leveraging shared geometric structures within the embedding spaces
produced by 𝑀1 and 𝑀2 .

The Strong Platonic Representation Hypothesis. Our hope that unsupervised embedding translation is possible at all
rests on the stronger version of the Platonic Representation Hypothesis [undefq]. Our conjecture is as follows: neural
networks trained with the same objective and modality, but with different data and model architectures, converge to a
universal latent space such that a translation between their respective representations can be learned without any
pairwise correspondence.

Translation enables information extraction. Solving unsupervised translation will allow us to use information
extraction tools designed to operate on vectors produced by known encoders. For example, we could apply inversion
models [undefap, undefaan] to recover unknown documents {𝑑𝑖 }.


3 Our method: vec2vec
Unsupervised translation has been successful in computer vision, using a combination of cycle consistency and
adversarial regularization [undefai, undefaaq]. Our design of vec2vec is inspired in part by these methods. We aim to
learn embedding-space translations that are cycle-consistent (mapping to and from an embedding space should end
in the same place) and indistinguishable (embeddings for the same text from either space should have identical
latents).

3.1 Architecture
We propose a modular architecture, where embeddings are encoded and decoded using space-specific adapter
modules and passed through a shared backbone network. Figure˜2 shows these components. Input adapters
       𝑑       𝑍             𝑑       𝑍
𝐴1 : ℝ → ℝ and 𝐴2 : ℝ → ℝ transform embeddings from each encoder-specific space into a universal latent
                                                            𝑍     𝑍
representation of dimension 𝑍. The shared backbone 𝑇 : ℝ → ℝ extracts a common latent embedding from adapted
                              𝑍     𝑑            𝑍       𝑑
inputs. Output adapters 𝐵1 : ℝ → ℝ and 𝐵2 : ℝ → ℝ translate these common latent embeddings back into the
encoder-specific spaces. Thus, translation functions 𝐹1 , 𝐹2 and additional reconstruction mappings 𝑅1 , 𝑅2 are defined
as:

𝐹1 = 𝐵2 ∘ 𝑇 ∘ 𝐴1 , 𝐹2 = 𝐵1 ∘ 𝑇 ∘ 𝐴2 𝑅1 = 𝐵1 ∘ 𝑇 ∘ 𝐴1 𝑅2 = 𝐵2 ∘ 𝑇 ∘ 𝐴2
Parameters of all components are collectively denoted 𝜃 = {𝐴1 , 𝐴2 , 𝑇, 𝐵1 , 𝐵2 }.
Unlike images, embeddings do not have any spatial bias. Instead of CNNs, we use multilayer perceptrons (MLP) with
residual connections, layer normalization, and SiLU nonlinearities. Discriminators mirror this structure but omit
residual connections to simplify adversarial learning.

3.2 Optimization
In addition to the ‘generator’ networks 𝐹 and 𝑅, we introduce discriminators operating on both the latent
representations of 𝐹 (𝐷ℓ1 , 𝐷ℓ2 ) and the output embeddings (𝐷1 , 𝐷2 ).

Our goal is to train the parameters of 𝜃 by solving:

𝜃∗ = arg ⁡min ⁡ max             ⁡ℒadv ​(𝐹1 , 𝐹2 , 𝐷1 , 𝐷2 , 𝐷ℓ1 , 𝐷ℓ2 ) + 𝜆gen ​ℒgen ​(𝜃), (1)
            𝜃 𝐷 , 𝐷 , 𝐷ℓ , 𝐷ℓ
               1   2   1    2

where ℒadv and ℒgen represent adversarial and generator-specific constraints respectively and hyperparameter 𝜆gen
controls their tradeoff.

Adversarial. The adversarial loss encourages generated embeddings to match the empirical distributions of original
embeddings both at the embedding and latent levels. Specifically, applying the standard GAN loss formulation
[undefl] to both levels yields:

 ℒadv (𝐹1 , 𝐹2 , 𝐷1 , 𝐷2 , 𝐷ℓ1 , 𝐷ℓ2 ) = ℒGAN ​(𝐷1 , 𝐹1 ) + ℒGAN ​(𝐷2 , 𝐹2 )
                                      +ℒGAN ​(𝐷ℓ1 , 𝑇 ∘ 𝐴1 ) + ℒGAN ​(𝐷ℓ2 , 𝑇 ∘ 𝐴2 ).
Generator. Because adversarial losses alone do not guarantee that translated embeddings preserve semantics
[undefaaq], we introduce three additional constraints to help the generator learn a useful mapping:

Reconstruction enforces that an embedding, when mapped into the latent space and back into its original embedding
space, closely matches its initial representation:
                                             2                             2
ℒrec (𝑅1 , 𝑅2 ) = 𝔼𝑥 ∼ 𝑝 ​‖𝑅1 ​(𝑥) − 𝑥‖2 + 𝔼𝑦 ∼ 𝑞 ​‖𝑅2 ​(𝑦) − 𝑦‖2 .
where 𝑝 and 𝑞 are distributions of embeddings sampled from 𝑀1 and 𝑀2 , respectively.

Cycle-consistency acts as an unsupervised proxy for supervised pair alignment, ensuring that 𝐹 and 𝐺 can translate
an embedding to the other embedding space and back again with minimal corruption:
                                                   2                                  2
ℒCC (𝐹1 , 𝐹2 ) = 𝔼𝑥 ∼ 𝑝 ​‖𝐹2 ​(𝐹1 ​(𝑥)) − 𝑥‖2 + 𝔼𝑦 ∼ 𝑞 ​‖𝐹1 ​(𝐹2 ​(𝑦)) − 𝑦‖2 .
Vector space preservation (VSP) ensures that pairwise relationships between translated embeddings are consistent
with the target space [undefas, undefaal]. Given a batch of 𝐵 embeddings 𝑥1 , …, 𝑥𝐵 and 𝑦1 , …, 𝑦𝐵 , we sum their
average pairwise distances after translation by both 𝐹1 and 𝐹2 :
                          𝐵       𝐵
ℒVSP (𝐹1 , 𝐹2 ) = 12 ∑ ∑ [ ‖𝑀1 ​(𝑥𝑖 ) ⋅ 𝑀1 ​(𝑥𝑗 ) − 𝐹2 ​(𝑀2 ​(𝑦𝑖 )) ⋅ 𝐹2 ​(𝑀2 ​(𝑦𝑗 ))‖2
                  𝐵 𝑖=1 𝑗=1                                                           2
                                                                                        2
                            +∥ 𝑀2 (𝑦𝑖 ) ⋅ 𝑀2 (𝑦𝑗 ) − 𝐹1 (𝑀1 (𝑥𝑖 )) ⋅ 𝐹1 (𝑀1 (𝑥𝑗 ))∥2 ]
Combining these losses yields: ℒgen (𝜃) = 𝜆rec ​ℒrec ​(𝑅1 , 𝑅2 ) + 𝜆CC ​ℒCC ​(𝐹1 , 𝐹2 ) + 𝜆VSP ​ℒVSP ​(𝐹1 , 𝐹2 ), where hyperparameters
𝜆CC , 𝜆rec , and 𝜆VSP control relative importance.


4 Experimental setup
4.1 Preliminaries
Datasets. We use the Natural Questions (NQ) [undefx] dataset of user queries and Wikipedia-sourced answers for
training (a 2-million subset) and evaluation (a 65536 subset). To evaluate information extraction, we use TweetTopic
[undefa], a dataset of tweets multi-labeled by 19 topics; a random 8192-record subset of Pseudo Re-identified MIMIC-
III (MIMIC) [undefaa], a pseudo re-identified version of the MIMIC dataset [undefr] of patient records multi-labeled by
2673 MedCAT [undefw] disease descriptions; and a random 50-email subset of the Enron Email Corpus (Enron)
[undeft], an unlabeled, public dataset of internal emails from a defunct energy company. In Appendix˜D, we ablate a
model on MS COCO [undefag], a captioned image dataset, to evaluate performance on multimodal retrieval.

Models. Table˜1 lists the embedding models representing four size categories, five transformer backbones, and two
output dimensionalities. Granite is multilingual; CLIP is multimodal. Since Qwen is very compute-intensive, we only
evaluate it for a single model pair in Appendix˜C.

Model               Params (M) Backbone Year Dims Max Seq.
[undefat] gtr       110       T5        2021 768 512
[undefaw] clip      151       CLIP      2021 512 77
[undefaae] e5       109       BERT      2022 768 512
[undefae] gte       109       BERT      2023 768 512
[undefaao] stella 109         BERT      2023 768 512
[undefm] granite 278          RoBERTa 2024 768 512
[undefaap] qwen 4000          Qwen3     2025 2560 32K
Table 1: Embedding models used in our experiments.

Training. Unless otherwise specified, each vec2vec is trained on two sets of embeddings generated from disjoint sets
of 1 million 64-token sequences sampled from NQ (see Section˜7 for experiments with fewer embeddings). Due to
GAN instability [undefaz], we select the best of multiple initializations (see Appendix˜E) and leave more robust
training to future work. See Appendix˜A for compute details.

4.2 Evaluating translation
Let 𝑢𝑖 = 𝑀1 ​(𝑑𝑖 ) and 𝑣𝑖 = 𝑀2 ​(𝑑𝑖 ) denote the source and target embeddings of the same input 𝑑𝑖 . The goal of translation
is to generate a vector that is as close to 𝑣𝑖 as possible. We say that (𝑢𝑖 , 𝑣𝑗 ) are “aligned” by the translator 𝐹 if 𝑣𝑗 is the
closest embedding to 𝐹(𝑢𝑖 ): 𝑗 = arg ⁡min𝑘 ⁡cos⁡(𝐹​(𝑢𝑖 ), 𝑣𝑘 ). A perfect translator 𝐹∗ satisfies 𝑖 = arg ⁡min𝑘 ⁡cos⁡(𝐹∗ ​(𝑢𝑖 ), 𝑣𝑘 ) for all 𝑖
.
                                                 𝑛
Given (unknown) embeddings {𝑀2 (𝑑𝑗 )}                ordered by decreasing cosine similarity to 𝐹​(𝑢𝑖 ), let 𝑟𝑖 be the rank of the
                                                 𝑗=0
correct embedding 𝑣𝑖 = 𝑀2 ​(𝑑𝑖 ). To measure quality of 𝐹, we use three metrics. Mean Cosine Similarity measures how
close translations are, on average, to their targets. Top-1 Accuracy is the fraction of translations whose target is closer
than any other embedding. Mean Rank is the average rank of targets with respect to translations. The ideal translator
𝐹∗ achieves mean similarity of 1.0, top-1 accuracy of 1.0, and mean rank of 1.0. Recall that a random alignment
corresponds to a mean rank of 𝑛2 . Formally,
                     𝑛                                           𝑛                             𝑛
cos(𝑢𝑖 , 𝑣𝑖 ) = 1𝑛 ​ ∑ [1 − cos⁡(𝐹​(𝑢𝑖 ), 𝑣𝑖 )] Top-1​(𝑟) = 1𝑛 ​ ∑ 𝟏​{𝑟𝑖 = 1}   Rank(r) = 1𝑛 ​ ∑ 𝑟𝑖
                 𝑖=1                                         𝑖=1                            𝑖=1
vec2vec is the first unsupervised embedding translator, thus there is no direct baseline. As our Naïve baseline, we
simply use 𝐹(𝑥) = 𝑥 to measure geometric similarity between embedding spaces. The second (pseudo)baseline is
Oracle-aided optimal transport. It assumes that candidate targets are known and is thus strictly easier than vec2vec
and the Naïve baseline. We solve optimal assignment, 𝜋∗ = arg ⁡min𝜋 ​∑𝑛𝑖 = 1 cos⁡(𝑢𝑖 , 𝑣𝜋​(𝑖) ), via either the Hungarian, Earth
Mover’s Distance, Sinkhorn, or (Entropic) Gromov-Wasserstein algorithms, choosing the solver with the lowest rank
for each experiment. See Appendix˜B for more details.

4.3 Evaluating information extraction
We measure whether translation preserves semantics via attribute inference: for each translated embedding 𝐹(𝑀1 (𝑑𝑖 )),
our goal is to infer attributes 𝑐𝑖 ⊆ 𝒞 of 𝑑𝑖 .

The first method we use is zero-shot embedding attribute inference: calculate pairwise cosine similarities between
𝐹(𝑀1 (𝑑𝑖 )) and the embeddings of all attributes in 𝒞, identify top 𝑘 closest attributes, and measure whether they are
correct via top-𝑘 accuracy: 1𝑛 ∑𝑛𝑖 = 0 𝟏​{|𝑐𝑘𝑖 ∩ 𝑐𝑖 | ≥ 1}.
The second method is embedding inversion that recovers text inputs from embeddings. Since [undefap] requires a
pre-trained inversion model for each embedding space, we use [undefaan] instead to generate an approximation 𝑑′𝑖 of
𝑑𝑖 from 𝐹(𝑀1 (𝑑𝑖 )) in a zero-shot manner. We measure the extracted information using LLM judge accuracy: the fraction
of translated embeddings for which GPT-4o determines that 𝑑′ reveals information in 𝑑. See Appendix˜H for our
prompt.

In addition to the Naïve baseline, we also consider an Oracle attribute inference: zero-shot classification with the
correct embedding 𝑀2 (𝑑) and class labels 𝑀2 (𝒞).


5 vec2vec learns to translate embeddings without any paired
data
We first show that vec2vec learns a universal latent space, then demonstrate that this space preserves the geometry
of all embeddings. Therefore, we can use it like a universal language of text encoders to translate their
representations without any paired data.

   Refer to caption




Figure 4: Pairwise cosine similarities of input embeddings (left) and their vec2vec latents (middle) across different embedding pairs.
The absolute difference between the heatmaps plots is on the right. All numbers are computed on the same batch of 1024 NQ
texts.

vec2vec learns a universal latent space. vec2vec projects embeddings 𝑀1, 2, … into a shared latent space via
compositions of input adapters (𝐴1, 2, … ) and a shared translator 𝑇. Figure˜4 shows that even when the embeddings
𝑢𝑖 = 𝑀1 ​(𝑑𝑖 ) and 𝑣𝑖 = 𝑀2 ​(𝑑𝑖 ) are far apart (i.e., have low cosine similarity), their representations in vec2vec’s latent
space are incredibly close: 𝑇(𝐴1 (𝑢𝑖 )) ≈ 𝑇​(𝐴2 ​(𝑣𝑖 )). Figure˜1 visualizes this (via two-dimensional projections) for vec2vec
trained on GTE and GTR embeddings: the embeddings are far apart, but their latents are nearly overlapping.

          vec2vec                    Naïve Baseline                 OT Baseline
𝑀1 𝑀2 cos(⋅ ) ↑ T-1 ↑ Rank ↓ cos⁡(⋅ ) ↑ T-1 ↑ Rank ↓                cos⁡(⋅ ) ↑ T-1 ↑ Rank ↓
     gtr 0.80 (0.0) 0.99 1.19 (0.1) -0.03 (0.0) 0.00 4168.73 (9.2) 0.70 (0.0) 0.00 2773.72 (8.6) ‡
     gte 0.87 (0.0) 0.95 1.18 (0.0) 0.01 (0.0) 0.00 4088.58 (9.2) 0.85 (0.0) 0.00 2680.02 (8.6) ‡
gra.
     ste. 0.79 (0.0) 0.98 1.05 (0.0) 0.01 (0.0) 0.00 4208.26 (9.2) 0.67 (0.0) 0.00 3446.52 (8.8)‡
     e5 0.85 (0.0) 0.98 1.11 (0.0) 0.02 (0.0) 0.00 4111.60 (9.2) 0.83 (0.0) 0.00 3569.59 (8.7)‡
     gra. 0.81 (0.0) 0.99 1.02 (0.0) -0.03 (0.0) 0.00 4169.76 (9.2) 0.70 (0.0) 0.00 2775.17 (8.6)‡
     gte 0.87 (0.0) 0.93 2.31 (0.1) 0.04 (0.0) 0.00 4080.92 (9.2) 0.85 (0.0) 0.00 3070.69 (8.9)‡
gtr
     ste. 0.80 (0.0) 0.99 1.03 (0.0) 0.00 (0.0) 0.00 4198.78 (9.2) 0.67 (0.0) 0.00 3559.06 (9.1)‡
     e5 0.83 (0.0) 0.84 2.88 (0.2) 0.03 (0.0) 0.00 4082.84 (9.2) 0.83 (0.0) 0.00 3888.01 (8.9) ‡
     gra. 0.75 (0.0) 0.95 1.22 (0.0) 0.01 (0.0) 0.00 4079.81 (9.3) 0.69 (0.0) 0.00 2664.38 (8.6) ‡
     gtr 0.75 (0.0) 0.91 2.64 (0.1) 0.04 (0.0) 0.00 4084.15 (9.2) 0.70 (0.0) 0.00 3064.16 (8.9) ‡
gte
     ste. 0.89 (0.0) 1.00 1.00 (0.0) 0.56 (0.0) 1.00 1.00 (0.0)     0.71 (0.0) 1.00 1.00 (0.0) †
     e5 0.87 (0.0) 0.99 5.19 (0.5) 0.68 (0.0) 1.00 1.00 (0.0)       0.84 (0.0) 1.00 1.00 (0.0) †
     gra. 0.80 (0.0) 0.98 1.08 (0.0) 0.01 (0.0) 0.00 4209.08 (9.3) 0.69 (0.0) 0.00 3419.44 (8.8)‡
     gtr 0.82 (0.0) 1.00 1.10 (0.0) 0.00 (0.0) 0.00 4192.31 (9.2) 0.70 (0.0) 0.00 3555.64 (9.0)‡
ste.
     gte 0.92 (0.0) 1.00 1.00 (0.0) 0.56 (0.0) 1.00 1.00 (0.0)      0.87 (0.0) 1.00 1.00 (0.0) †
     e5 0.86 (0.0) 1.00 1.00 (0.0) 0.38 (0.0) 0.99 1.03 (0.0)       0.83 (0.0) 1.00 1.00 (0.0) †
e5 gra. 0.81 (0.0) 0.99 2.20 (0.2) 0.02 (0.0) 0.00 4120.60 (9.3) 0.69 (0.0) 0.00 3526.02 (8.7) ‡
     gtr 0.74 (0.0) 0.82 2.56 (0.0) 0.03 (0.0) 0.00 4080.76 (9.3) 0.70 (0.0) 0.00 3877.03 (8.8) ‡
     gte 0.90 (0.0) 1.00 1.01 (0.0) 0.68 (0.0) 1.00 1.00 (0.0)      0.86 (0.0) 1.00 1.00 (0.0) †
        vec2vec                    Naïve Baseline                 OT Baseline
𝑀1 𝑀2 cos ⋅ ↑ T-1 ↑ Rank ↓ cos ⋅ ↑ T-1 ↑ Rank ↓                   cos ⋅ ↑ T-1 ↑ Rank ↓
   ste. 0.78 (0.0) 1.00 1.00 (0.0) 0.38 (0.0) 1.00 1.00 (0.0)     0.69 (0.0) 1.00   1.00 (0.0) †
Table 2: In-distribution translations: vec2vecs trained on NQ and evaluated on a 65536 text subset of NQ (chunked in batches of
size 8192). The rank metric varies from 1 to 8192, thus 4096 corresponds to a random ordering. Standard errors are shown in
parentheses. Bold denotes best value. Symbols denote the lowest-rank solver for specific experiments: Sinkhorn† and Gromov-
Wasserstein‡.

vec2vec translations mirror target geometry. Table˜2 shows that vec2vec generates embeddings with near-optimal
assignment across model pairs, achieving cosine similarity scores up to 0.92, top-1 accuracies up to 100%, and ranks
as low as 1. In same-backbone pairings (e.g., (gte, e5)), vec2vec’s top-1 accuracy and rank are comparable to both
the naïve baseline and (surprisingly) the oracle-aided optimal transport. Although the embeddings generated by
vec2vec are significantly closer to the ground truth than the naïve baseline, in same-backbone pairings the
embeddings are close enough to be compatible. In cross-backbone pairings, vec2vec is far superior on all metrics,
while baseline methods perform similarly to random guessing.

            TweetTopic                 MIMIC
𝑀1    𝑀2 cos(⋅ ) ↑ T-1 ↑ Rank ↓ cos⁡(⋅ ) ↑ T-1 ↑ Rank ↓
      gtr 0.74 (0.0) 0.99 1.09 (0.1) 0.74 (0.0) 0.60 23.38 (1.6)
      gte 0.85 (0.0) 0.95 1.26 (0.1) 0.85 (0.0) 0.08 346.21 (7.8)
gran.
      stel. 0.77 (0.0) 0.96 1.11 (0.0) 0.72 (0.0) 0.13 242.23 (6.1)
      e5 0.83 (0.0) 0.87 3.10 (0.7) 0.84 (0.0) 0.12 361.06 (8.7)
      gran. 0.79 (0.0) 0.98 2.41 (0.6) 0.78 (0.0) 0.51 35.27 (1.9)
      gte 0.85 (0.0) 0.96 1.29 (0.2) 0.84 (0.0) 0.12 279.56 (6.9)
gtr
      stel. 0.77 (0.0) 0.96 1.10 (0.0) 0.72 (0.0) 0.27 127.92 (4.4)
      e5 0.80 (0.0) 0.53 13.38 (1.2) 0.82 (0.0) 0.01 1413.80 (18.3)
      gran. 0.73 (0.0) 0.94 1.33 (0.1) 0.73 (0.0) 0.09 342.15 (7.8)
      gtr 0.71 (0.0) 0.95 1.29 (0.1) 0.69 (0.0) 0.12 256.63 (6.4)
gte
      stel. 0.86 (0.0) 1.00 1.00 (0.0) 0.85 (0.0) 1.00 1.00 (0.0)
      e5 0.83 (0.0) 0.91 1.57 (0.2) 0.86 (0.0) 0.54 17.71 (0.9)
      gran. 0.79 (0.0) 0.99 1.09 (0.1) 0.77 (0.0) 0.14 221.95 (5.9)
      gtr 0.77 (0.0) 1.00 1.00 (0.0) 0.75 (0.0) 0.56 17.70 (1.0)
stel.
      gte 0.90 (0.0) 1.00 1.00 (0.0) 0.91 (0.0) 1.00 1.00 (0.0)
      e5 0.85 (0.0) 0.98 1.05 (0.0) 0.85 (0.0) 0.51 26.33 (1.2)
      gran. 0.79 (0.0) 0.98 1.08 (0.0) 0.78 (0.0) 0.21 151.09 (4.6)
      gtr 0.67 (0.0) 0.80 3.10 (0.6) 0.66 (0.0) 0.01 1029.64 (14.9)
e5
      gte 0.87 (0.0) 0.99 1.02 (0.0) 0.87 (0.0) 0.60 32.59 (2.6)
      stel. 0.75 (0.0) 0.98 1.06 (0.0) 0.75 (0.0) 0.46 32.12 (1.4)
Table 3: Out-of-distribution translations: vec2vecs trained on NQ and evaluated on the entire TweetTopic test set (800 tweets) and
an 8192-record subset of MIMIC. The rank metric varies from 1 to 800 (for TweetTopic) and 8192 (for MIMIC), thus 400 and,
respectively, 4096 correspond to a random ordering. Standard errors are shown in parentheses.

Table˜3 shows that this performance extends to out-of-distribution data. Our vec2vec translators were trained on NQ
(drawn from Wikipedia), yet exhibit high cosine similarity, high accuracy, and low rank when evaluated on tweets
(which are far more colloquial and use emojis) and medical records (which contain domain-specific jargon unlikely to
appear in NQ). In Appendix˜F, we show that baseline methods fail on cross-backbone embedding pairs.

          vec2vec                       OT Baseline
𝑀1 𝑀2 cos(⋅ ) ↑ T-1 ↑ Rank ↓            cos⁡(⋅ ) ↑ T-1 ↑ Rank ↓
gra.      0.78 (0.0) 0.35 226.62 (3.2) 0.76 (0.0) 0.00 4073.58 (9.4) ‡
gtr       0.73 (0.0) 0.13 711.23 (5.9) 0.59 (0.0) 0.00 4096.78 (9.2) ‡
gte clip 0.62 (0.0) 0.00 3233.41 (9.8) 0.76 (0.0) 0.00 4026.96 (9.4) ‡
ste.      0.77 (0.0) 0.31 286.69 (3.6) 0.76 (0.0) 0.00 3955.71 (8.9) ‡
e5        0.64 (0.0) 0.01 2568.21 (9.4) 0.77 (0.0) 0.00 3771.52 (9.1)‡
     gra. 0.74 (0.0) 0.72 4.46 (0.1)    0.69 (0.0) 0.00 4053.11 (9.4)‡
     gtr 0.67 (0.0) 0.27 155.11 (2.1) 0.49 (0.0) 0.00 4096.35 (9.2)‡
clip gte 0.75 (0.0) 0.00 2678.90 (8.9) 0.85 (0.0) 0.00 4025.81 (9.3)‡
     ste. 0.72 (0.0) 0.61 22.50 (0.5) 0.67 (0.0) 0.00 3951.73 (8.9)‡
     e5 0.73 (0.0) 0.01 1692.28 (8.2) 0.83 (0.0) 0.00 3771.38 (9.0)‡
Table 4: Translations between unimodal and multimodal (CLIP) embeddings: vec2vecs trained on NQ and evaluated on a 65536
text subset of NQ (chunked in batches of size 8192). Rank varies from 1 to 8192, thus 4096 corresponds to a random ordering.
Since the embedding dimensionalities are different, only the Gromov-Wasserstein‡ OT baseline is run and the naive baseline does
not apply. Bold denotes best value.
Finally, Table˜4 shows that vec2vec can even translate to and from the space of CLIP, a multimodal embedding model
which was trained in part on image data. While the translations are not as strong as in Table˜2, vec2vec consistently
outperforms the optimal transport baseline. These results show the promise of our method at adapting to new
modalities: in particular, the embedding space of CLIP has been successfully connected to other modalities such as
heatmaps, audio, and depth charts [undefk].


6 Using vec2vec translations to extract information
In this section, we show that vec2vec translations not only preserve the geometric structure of embeddings but also
retain sufficient semantics to enable attribute inference.

            TweetTopic (𝑘 = 1)    MIMIC (𝑘 = 10)
𝑀1    𝑀2 vec2vec Naïve 𝑀1 𝑀2 vec2vec Naïve 𝑀1 𝑀2
      gtr 0.25     0.10 0.30 0.24 0.19    0.11 0.76 0.88
      gte 0.32     0.09 0.30 0.34 0.36    0.13 0.76 1.00
gran.
      stel. 0.24   0.10 0.30 0.28 0.27    0.04 0.76 0.96
      e5 0.31      0.18 0.30 0.31 0.19    0.20 0.76 0.97
      gran. 0.34   0.08 0.24 0.30 0.16    0.12 0.88 0.76
      gte 0.33     0.13 0.24 0.34 0.28    0.05 0.88 1.00
gtr
      stel. 0.30   0.10 0.24 0.28 0.25    0.07 0.88 0.96
      e5 0.30      0.04 0.24 0.31 0.09    0.09 0.88 0.97
      gran. 0.37   0.04 0.34 0.30 0.18    0.11 1.00 0.76
      gtr 0.24     0.13 0.34 0.24 0.10    0.03 1.00 0.88
gte
      stel. 0.31   0.20 0.34 0.28 0.68    0.83 1.00 0.96
      e5 0.37      0.30 0.34 0.31 0.37    0.63 1.00 0.97
      gran. 0.35   0.07 0.28 0.30 0.23    0.09 0.96 0.76
      gtr 0.26     0.13 0.28 0.24 0.22    0.09 0.96 0.88
stel.
      gte 0.38     0.36 0.28 0.34 0.90    0.98 0.96 1.00
      e5 0.35      0.34 0.28 0.31 0.38    0.46 0.96 0.97
      gran. 0.33   0.15 0.31 0.30 0.14    0.07 0.97 0.76
      gtr 0.26     0.22 0.31 0.24 0.11    0.04 0.97 0.88
e5
      gte 0.34     0.28 0.31 0.34 0.47    0.66 0.97 1.00
      stel. 0.26   0.16 0.31 0.28 0.36    0.40 0.97 0.96
Table 5: Information leakage via top-𝑘 zero-shot attribute inference: vec2vecs trained on NQ and evaluated on the TweetTopic test
set (800 tweets) and an 8192-record subset of MIMIC. 𝑀1 and 𝑀2 represent ideal zero-shot inference: attributes and embeddings
are encoded using the same model.

     Refer to caption




Figure 5: Leakage of information via inversion. Trained on NQ and evaluated on a 50-email subset of the Enron Email Corpus.
Cells denote judge accuracy.

Zero-shot attribute inference. Table˜5 shows that attribute inference on vec2vec translations consistently outperforms
the naïve baseline and often does better than the ideal zero-shot baseline which performs inference on ground-truth
document and attribute embeddings in the same space (this baseline is imaginary since these embeddings are not
available in our setting).

vec2vec translations even work for embeddings of medical records, which are much further from the training
distribution than tweets. The attributes in this case are MedCAT disease descriptions, very few of which occur in the
training data. Attribute inference on translated embeddings is comparable to the naïve baseline in same-backbone
pairings and outperforms it (often greatly) in cross-backbone pairings. The fact that vec2vec preserves the semantics
of concepts like "alveolar periostitis" (which never appears in its training data) is evidence that its latent space is
indeed a universal representation.

Zero-shot inversion. Inversion, i.e., reconstruction of text inputs, is more ambitious than attribute inference. vec2vec
translations retain enough semantic information that off-the-shelf, zero-shot inversion methods like [undefaan],
developed for embeddings computed by standard encoders, extract information for as many as 80% of emails and
67% of tweets given only their translated embeddings, for some model pairs (Figure˜5 and Appendix˜G). These
inversions are imperfect and we leave development of specialized inverters for translated embeddings to future work.
Nevertheless, as exemplified in Figure˜6, they still extract potentially sensitive information such as individual and
company names, dates, promotions, financial information, outages, and even lunch orders. In Appendix˜H, we show
the prompt we use to measure extraction.


 Ground Truth: “Subject: Enron Bashing on Frontline \n Body:…" Generation:
 “Some emails discussing NROn Employee/s Complaint To thePublic…" Ground
 Truth: “Subject: Trades for 3/1/02 \n Body: \n John, \n The following trades…"
 Generation: “… future transactions may await John G…" Ground Truth: “The
 following expense report is ready for approval…" Generation: “The upcoming
 expense statement from YYYY MM Dec…"




Figure 6: Examples of Enron Email Corpus inversions that infer entities and content.
7 Ablations
Method               cos(⋅ ) ↑ T-1 ↑ Rank ↓
vec2vec              0.75 (0.0) 0.91 2.64 (0.1)
Naïve Baseline       0.04 (0.0) 0.00 4084.15 (9.2)
OT Baseline          0.70 (0.0) 0.00 3064.16 (8.9)
– VSP loss           0.58 (0.0) 0.00 4196.64 (9.2)
– CC loss            0.50 (0.0) 0.00 3941.36 (9.3)
– latent GAN         0.49 (0.0) 0.00 3897.09 (9.5)
– VSP and CC loss    0.47 (0.0) 0.00 3365.24 (9.3)
– hyperparam. tuning 0.50 (0.0) 0.00 4011.73 (9.3)
Table 6: gte → gtr translators trained without individual components of our method on NQ and evaluated on a 65536-text subset
of NQ (chunked in batches of 8192). The rank metric varies from 1 to 8192, thus 4096 corresponds to a random ordering.
Standard errors are shown in parentheses.

Each component of our method is important. We ablate our method subtractively, measuring the key metrics after
removing individual components of our algorithm (described in Section˜3). Table˜6 shows that each component
appears to be critical to building good translations. While vec2vec’s cos(⋅) is higher than the naïve baseline, it
performs worse across the board than the OT baseline and does not preserve the geometry of the vector space.

𝑁       cos(⋅ ) ↑ T-1 ↑ Rank ↓
1000000 0.75 (0.0) 0.92 2.73 (0.2)
10000 0.57 (0.0) 0.01 1462.21 (20.)
50000 0.74 (0.0) 0.81 3.91 (0.6)
100000 0.74 (0.0) 0.85 4.52 (0.4)
500000 0.75 (0.0) 0.92 2.73 (0.2)
Table 7: gte → gtr translators trained with different amounts of GTE data: vec2vec models trained on NQ and evaluated an 8192-
record subset of NQ. The rank metric varies from 1 to 8192, thus 4096 corresponds to a random ordering. Standard errors are
shown in parentheses.

vec2vecs can be trained with significantly less data. In Sections˜5 and 6, we use 1M-point subsets of NQ to train our
vec2vec models. Now, we train the gte → gtr vec2vec with 1M GTR embeddings but fewer GTE embeddings.
Table˜7 shows that with as few as 10K embeddings, the translators still learn something (i.e. are better than random).
Translations trained on 50K embeddings are almost as good as those trained on 1M. Translations generally improve
with more training data.


8 Related work
Representation alignment. Similarities between representations of different neural networks are investigated in
[undefy, undefad, undefaaf, undefd, undefq, undefaah, undefac]. Methods based on CCA [undefao], SVCCA,
[undefax], CKA [undefv, undefak], ICA [undefaaj], time-series [undefal], and GUIs [undefo] have been used to compare
embeddings from different subspaces. [undefaj, undefar, undefam, undefaad, undefau] harness representation
similarity for zero-shot stitching, substitution, domain transfer, and multimodal adaptation. All rely on some amount of
paired data, which is difficult to reduce [undefe]. Our method does not just measure similarity, we learn how to
translate representations across spaces without any paired data.

Optimal transport. The problem of unsupervised optimal transport has been studied for image style transfer [undefp,
undefai, undefaaq], word translation [undefaai, undefi, undefn, undefh, undefs], and natural language sequence
translation [undefay, undefz, undef, undefc, undefaak, undefb]. Our method builds on these works, which often employ
a combination of cycle-consistency and adversarial loss. Importantly, unlike prior word and sequence translation
methods, multiple representations of the same input (e.g., heavily overlapping word vocabularies) are unavailable in
our setting. [undefaaa] proposes a solver for matching small sets of embeddings between different vision-language
models. Our method goes well beyond matching by taking unknown embeddings and generating matching
embeddings in the space of another model.

Embedding inversion. An emerging line of research investigates decoding text from language model embeddings
[undefaab, undefab, undefap] and outputs [undefaq, undeff, undefaam]. vec2vec helps apply these to unknown
embeddings, without an encoder or paired data, by translating them to the space of a known model.
Bridging modality gaps. Previous work has noted an inherent “gap” between image- and text-based models [undefaf]
and proposed various ways to unify the modalities [undefaac]. Some approaches feed image embeddings directly into
language models [undefu, undefaag, undefj, undefah], while others generate captions from image embeddings
[undefan] or even from text embeddings themselves [undefap]. [undefk] introduces a shared embedding space that
integrates inputs from multiple modalities, including text, audio, and vision. In contrast, our post-hoc approach directly
translates between representations and complements these systems by enabling inputs from a wide variety of
embedding models.


9 Discussion and Future Work
The Platonic Representation Hypothesis conjectures that the representation spaces of modern neural networks are
converging. We assert the Strong Platonic Representation Hypothesis: the latent universal representation can be
learned and harnessed to translate between representation spaces without any encoders or paired data.

In Section˜5, we demonstrated that our vec2vec method successfully translates embeddings generated from unseen
documents by unseen encoders, and the translator is robust to (sometimes very) out-of-distribution inputs. This
suggests that vec2vec learns domain-agnostic translations based on the universal geometric relationships which
encode the same semantics in multiple embedding spaces.

In Section˜6, we showed that vec2vec translations preserve sufficient input semantics to enable attribute inference.
We extracted sensitive disease information from patient records and partial content from corporate emails, with
access only to document embeddings and no access to the encoder that produced them. Better translation methods
will enable higher-fidelity extraction, confirming once again that embeddings reveal (almost) as much as their inputs.

Our findings provide compelling evidence for the Strong Platonic Representation Hypothesis for text-based models.
Our preliminary results on CLIP suggest that the universal geometry can be harnessed in other modalities, too. The
results in this paper are but a lower bound on inter-representation translation. Better and more stable learning
algorithms, architectures, and other methodological improvements will support scaling to more data, more model
families, and more modalities.


Acknowledgments and Disclosure of Funding
This research is supported in part by the Google Cyber NYC Institutional Research Program. RJ is supported by the
Digital Life Initiative Fellowship and JM by the National Science Foundation.


References
    [undef] ↑ David Alvarez-Melis and Tommi S. Jaakkola “Gromov-Wasserstein Alignment of Word Embedding
    Spaces”, 2018 arXiv: https://arxiv.org/abs/1809.00013
    [undefa] ↑ Dimosthenis Antypas, Asahi Ushio, Francesco Barbieri and Jose Camacho-Collados “Multilingual
    Topic Classification in X: Dataset and Analysis” In Proceedings of the 2024 Conference on Empirical Methods in
    Natural Language Processing Miami, Florida, USA: Association for Computational Linguistics, 2024, pp. 20136–
    20152 DOI: 10.18653/v1/2024.emnlp-main.1123
    [undefb] ↑ Mikel Artetxe, Gorka Labaka and Eneko Agirre “A robust self-learning method for fully unsupervised
    cross-lingual mappings of word embeddings” In Proceedings of the 56th Annual Meeting of the Association for
    Computational Linguistics (Volume 1: Long Papers) Melbourne, Australia: Association for Computational
    Linguistics, 2018, pp. 789–798 DOI: 10.18653/v1/P18-1073
    [undefc] ↑ Mikel Artetxe, Gorka Labaka, Eneko Agirre and Kyunghyun Cho “Unsupervised Neural Machine
    Translation”, 2018 arXiv: https://arxiv.org/abs/1710.11041
    [undefd] ↑ Yamini Bansal, Preetum Nakkiran and Boaz Barak “Revisiting Model Stitching to Compare Neural
    Representations”, 2021 arXiv: https://arxiv.org/abs/2106.07682
[undefe] ↑ Irene Cannistraci et al. “Bootstrapping Parallel Anchors for Relative Representations”, 2023 arXiv:
https://arxiv.org/abs/2303.00721
[undeff] ↑ Nicholas Carlini et al. “Stealing Part of a Production Language Model”, 2024 arXiv:
https://arxiv.org/abs/2403.06634
[undefg] ↑ Liqun Chen et al. “Graph Optimal Transport for Cross-Domain Alignment”, 2020 arXiv:
https://arxiv.org/abs/2006.14744
[undefh] ↑ Xilun Chen and Claire Cardie “Unsupervised Multilingual Word Embeddings”, 2018 arXiv:
https://arxiv.org/abs/1808.08933
[undefi] ↑ Alexis Conneau et al. “Word Translation Without Parallel Data”, 2018 arXiv:
https://arxiv.org/abs/1710.04087
[undefj] ↑ Runpei Dong et al. “DreamLLM: Synergistic Multimodal Comprehension and Creation”, 2024 arXiv:
https://arxiv.org/abs/2309.11499
[undefk] ↑ Rohit Girdhar et al. “ImageBind: One Embedding Space To Bind Them All”, 2023 arXiv:
https://arxiv.org/abs/2305.05665
[undefl] ↑ Ian Goodfellow et al. “Generative adversarial networks” In Commun. ACM 63.11 New York, NY, USA:
Association for Computing Machinery, 2020, pp. 139–144 DOI: 10.1145/3422622
[undefm] ↑ IBM Granite Embedding Team “Granite Embedding Models”, 2024 URL: https://github.com/ibm-
granite/granite-embedding-models/
[undefn] ↑ Edouard Grave, Armand Joulin and Quentin Berthet “Unsupervised Alignment of Embeddings with
Wasserstein Procrustes”, 2018 arXiv: https://arxiv.org/abs/1805.11222
[undefo] ↑ Florian Heimerl, Christoph Kralj, Torsten Moller and Michael Gleicher “embComp: Visual Interactive
Comparison of Vector Embeddings” In IEEE Transactions on Visualization and Computer Graphics 28.8 Institute
of ElectricalElectronics Engineers (IEEE), 2022, pp. 2953–2969 DOI: 10.1109/tvcg.2020.3045918
[undefp] ↑ Xun Huang, Ming-Yu Liu, Serge Belongie and Jan Kautz “Multimodal Unsupervised Image-to-Image
Translation”, 2018 arXiv: https://arxiv.org/abs/1804.04732
[undefq] ↑ Minyoung Huh, Brian Cheung, Tongzhou Wang and Phillip Isola “The Platonic Representation
Hypothesis”, 2024 arXiv: https://arxiv.org/abs/2405.07987
[undefr] ↑ Alistair EW Johnson et al. “MIMIC-III, a freely accessible critical care database” In Scientific data 3.1
Nature Publishing Group, 2016, pp. 1–9
[undefs] ↑ Armand Joulin et al. “Loss in Translation: Learning Bilingual Word Mapping with a Retrieval
Criterion” In Proceedings of the 2018 Conference on Empirical Methods in Natural Language Processing
Brussels, Belgium: Association for Computational Linguistics, 2018, pp. 2979–2984 DOI: 10.18653/v1/D18-1330
[undeft] ↑ Bryan Klimt and Yiming Yang “The enron corpus: a new dataset for email classification research” In
Proceedings of the 15th European Conference on Machine Learning, ECML’04 Pisa, Italy: Springer-Verlag,
2004, pp. 217–226 DOI: 10.1007/978-3-540-30115-8_22
[undefu] ↑ Jing Yu Koh, Ruslan Salakhutdinov and Daniel Fried “Grounding language models to images for
multimodal inputs and outputs” In International Conference on Machine Learning, 2023, pp. 17283–17300 PMLR
[undefv] ↑ Simon Kornblith, Mohammad Norouzi, Honglak Lee and Geoffrey Hinton “Similarity of Neural
Network Representations Revisited”, 2019 arXiv: https://arxiv.org/abs/1905.00414
[undefw] ↑ Zeljko Kraljevic et al. “Multi-domain clinical natural language processing with MedCAT: the medical
concept annotation toolkit” In Artificial intelligence in medicine 117 Elsevier, 2021, pp. 102083
[undefx] ↑ Tom Kwiatkowski et al. “Natural Questions: A Benchmark for Question Answering Research” In
Transactions of the Association for Computational Linguistics 7 Cambridge, MA: MIT Press, 2019, pp. 452–466
DOI: 10.1162/tacl_a_00276
[undefy] ↑ Aarre Laakso and Garrison Cottrell “Content and cluster analysis: Assessing representational
similarity in neural systems” In Philosophical Psychology 13.1, 2000, pp. 47–76 DOI:
10.1080/09515080050002726
[undefz] ↑ Guillaume Lample, Alexis Conneau, Ludovic Denoyer and Marc’Aurelio Ranzato “Unsupervised
Machine Translation Using Monolingual Corpora Only”, 2018 arXiv: https://arxiv.org/abs/1711.00043
[undefaa] ↑ Eric Lehman et al. “Does BERT Pretrained on Clinical Notes Reveal Sensitive Data?” In
Proceedings of the 2021 Conference of the North American Chapter of the Association for Computational
Linguistics: Human Language Technologies Online: Association for Computational Linguistics, 2021, pp. 946–
959 DOI: 10.18653/v1/2021.naacl-main.73
[undefab] ↑ Haoran Li, Mingshi Xu and Yangqiu Song “Sentence Embedding Leaks More Information than You
Expect: Generative Embedding Inversion Attack to Recover the Whole Sentence”, 2023 arXiv:
https://arxiv.org/abs/2305.03010
[undefac] ↑ Jiaang Li, Yova Kementchedjhieva, Constanza Fierro and Anders Søgaard “Do Vision and
Language Models Share Concepts? A Vector Space Alignment Study” In Transactions of the Association for
Computational Linguistics 12 Cambridge, MA: MIT Press, 2024, pp. 1232–1249 DOI: 10.1162/tacl_a_00698
[undefad] ↑ Yixuan Li et al. “Convergent Learning: Do different neural networks learn the same
representations?”, 2016 arXiv: https://arxiv.org/abs/1511.07543
[undefae] ↑ Zehan Li et al. “Towards General Text Embeddings with Multi-stage Contrastive Learning”, 2023
arXiv: https://arxiv.org/abs/2308.03281
[undefaf] ↑ Weixin Liang et al. “Mind the Gap: Understanding the Modality Gap in Multi-modal Contrastive
Representation Learning”, 2022 arXiv: https://arxiv.org/abs/2203.02053
[undefag] ↑ Tsung-Yi Lin et al. “Microsoft coco: Common objects in context” In European conference on
computer vision, 2014, pp. 740–755 Springer
[undefah] ↑ Haotian Liu, Chunyuan Li, Qingyang Wu and Yong Jae Lee “Visual Instruction Tuning”, 2023 arXiv:
https://arxiv.org/abs/2304.08485
[undefai] ↑ Ming-Yu Liu, Thomas Breuel and Jan Kautz “Unsupervised Image-to-Image Translation Networks”,
2018 arXiv: https://arxiv.org/abs/1703.00848
[undefaj] ↑ Valentino Maiorca et al. “Latent Space Translation via Semantic Alignment”, 2024 arXiv:
https://arxiv.org/abs/2311.00664
[undefak] ↑ Mayug Maniparambil et al. “Do Vision and Language Encoders Represent the World Similarly?” In
Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition, 2024, pp. 14334–14343
[undefal] ↑ Deven M Mistry and Ali A Minai “A Comparative Study of Sentence Embedding Models for
Assessing Semantic Variation” In International Conference on Artificial Neural Networks, 2023, pp. 1–12
[undefam] ↑ Mazda Moayeri, Keivan Rezaei, Maziar Sanjabi and Soheil Feizi “Text-To-Concept (and Back) via
Cross-Model Alignment”, 2023 arXiv: https://arxiv.org/abs/2305.06386
[undefan] ↑ Ron Mokady, Amir Hertz and Amit H. Bermano “ClipCap: CLIP Prefix for Image Captioning”, 2021
arXiv: https://arxiv.org/abs/2111.09734
[undefao] ↑ Ari S. Morcos, Maithra Raghu and Samy Bengio “Insights on representational similarity in neural
networks with canonical correlation”, 2018 arXiv: https://arxiv.org/abs/1806.05759
[undefap] ↑ John X. Morris, Volodymyr Kuleshov, Vitaly Shmatikov and Alexander M. Rush “Text Embeddings
Reveal (Almost) As Much As Text”, 2023 arXiv: https://arxiv.org/abs/2310.06816
[undefaq] ↑ John X. Morris et al. “Language Model Inversion”, 2023 arXiv: https://arxiv.org/abs/2311.13647
[undefar] ↑ Luca Moschella et al. “Relative representations enable zero-shot latent space communication”, 2023
arXiv: https://arxiv.org/abs/2209.15430
[undefas] ↑ Nikola Mrksic et al. “Counter-fitting Word Vectors to Linguistic Constraints”, 2016 arXiv:
https://arxiv.org/abs/1603.00892
[undefat] ↑ Jianmo Ni et al. “Large Dual Encoders Are Generalizable Retrievers”, 2021 arXiv:
https://arxiv.org/abs/2112.07899
[undefau] ↑ Antonio Norelli et al. “ASIF: Coupled Data Turns Unimodal Models to Multimodal Without Training”,
2023 arXiv: https://arxiv.org/abs/2210.01738
[undefav] ↑ Gabriel Peyré, Marco Cuturi and Justin Solomon “Gromov-Wasserstein Averaging of Kernel and
Distance Matrices” In Proceedings of the 33rd International Conference on Machine Learning (ICML) 48, JMLR:
Workshop and Conference Proceedings New York, NY, USA: JMLR, 2016
[undefaw] ↑ Alec Radford et al. “Learning Transferable Visual Models From Natural Language Supervision”,
2021 arXiv: https://arxiv.org/abs/2103.00020
[undefax] ↑ Maithra Raghu, Justin Gilmer, Jason Yosinski and Jascha Sohl-Dickstein “SVCCA: Singular Vector
Canonical Correlation Analysis for Deep Learning Dynamics and Interpretability”, 2017 arXiv:
https://arxiv.org/abs/1706.05806
[undefay] ↑ Sujith Ravi and Kevin Knight “Deciphering Foreign Language” In Proceedings of the 49th Annual
Meeting of the Association for Computational Linguistics: Human Language Technologies Portland, Oregon,
USA: Association for Computational Linguistics, 2011, pp. 12–21 URL: https://aclanthology.org/P11-1002/
[undefaz] ↑ Divya Saxena and Jiannong Cao “Generative Adversarial Networks (GANs): Challenges, Solutions,
and Future Directions” In ACM Comput. Surv. 54.3 New York, NY, USA: Association for Computing Machinery,
2021 DOI: 10.1145/3446374
[undefaaa] ↑ Dominik Schnaus, Nikita Araslanov and Daniel Cremers “It’s a (Blind) Match! Towards Vision-
Language Correspondence without Parallel Data”, 2025 arXiv: https://arxiv.org/abs/2503.24129
[undefaab] ↑ Congzheng Song and Ananth Raghunathan “Information Leakage in Embedding Models”, 2020
arXiv: https://arxiv.org/abs/2004.00053
[undefaac] ↑ Shezheng Song et al. “How to Bridge the Gap between Modalities: A Comprehensive Survey on
Multimodal Large Language Model”, 2023 arXiv: https://arxiv.org/abs/2311.07594
[undefaad] ↑ Yingtao Tian and Jesse Engel “Latent translation: Crossing modalities by bridging generative
models” In arXiv preprint arXiv:1902.08261, 2019
[undefaae] ↑ Liang Wang et al. “Text Embeddings by Weakly-Supervised Contrastive Pre-training”, 2024 arXiv:
https://arxiv.org/abs/2212.03533
[undefaaf] ↑ Liwei Wang et al. “Towards Understanding Learning Representations: To What Extent Do Different
Neural Networks Learn the Same Representation”, 2018 arXiv: https://arxiv.org/abs/1810.11750
[undefaag] ↑ Wenhai Wang et al. “VisionLLM: Large Language Model is also an Open-Ended Decoder for
Vision-Centric Tasks”, 2023 arXiv: https://arxiv.org/abs/2305.11175
[undefaah] ↑ Christopher Wolfram and Aaron Schein “Layers at similar depths generate similar activations
across llm architectures” In arXiv preprint arXiv:2504.08775, 2025
[undefaai] ↑ Chao Xing, Dong Wang, Chao Liu and Yiye Lin “Normalized Word Embedding and Orthogonal
Transform for Bilingual Word Translation” In Proceedings of the 2015 Conference of the North American Chapter
of the Association for Computational Linguistics: Human Language Technologies Denver, Colorado: Association
for Computational Linguistics, 2015, pp. 1006–1011 DOI: 10.3115/v1/N15-1104
[undefaaj] ↑ Hiroaki Yamagiwa, Momose Oyama and Hidetoshi Shimodaira “Discovering Universal Geometry in
Embeddings with ICA”, 2023 arXiv: https://arxiv.org/abs/2305.13175
[undefaak] ↑ Zhen Yang, Wei Chen, Feng Wang and Bo Xu “Unsupervised Neural Machine Translation with
Weight Sharing”, 2018 arXiv: https://arxiv.org/abs/1804.09057
     [undefaal] ↑ Jinsung Yoon and Sercan O Arik “Embedding-Converter: A Unified Framework for Cross-Model
     Embedding Transformation”, 2025 URL: https://openreview.net/forum?id=ga9PAnFsAt
     [undefaam] ↑ Collin Zhang, John X. Morris and Vitaly Shmatikov “Extracting Prompts by Inverting LLM Outputs”,
     2024 arXiv: https://arxiv.org/abs/2405.15012
     [undefaan] ↑ Collin Zhang, John X. Morris and Vitaly Shmatikov “Universal Zero-shot Embedding Inversion”,
     2025 arXiv: https://arxiv.org/abs/2504.00147
     [undefaao] ↑ Dun Zhang, Jiacheng Li, Ziyang Zeng and Fulong Wang “Jasper and Stella: distillation of SOTA
     embedding models”, 2025 arXiv: https://arxiv.org/abs/2412.19048
     [undefaap] ↑ Yanzhao Zhang et al. “Qwen3 Embedding: Advancing Text Embedding and Reranking Through
     Foundation Models” In arXiv preprint arXiv:2506.05176, 2025
     [undefaaq] ↑ Jun-Yan Zhu, Taesung Park, Phillip Isola and Alexei A. Efros “Unpaired Image-to-Image
     Translation using Cycle-Consistent Adversarial Networks”, 2020 arXiv: https://arxiv.org/abs/1703.10593


Appendix A Compute
Our training and evaluation were conducted using diverse compute environments, including both local and cloud
GPU clusters. Experiments were done on NVIDIA 2080Ti, L4, A40, and A100 GPUs, listed in order of increasing
computational capacity.

For our final results, we trained 25 vec2vec models fully and 30 models partially (see Appendix˜E). The full models’
training durations usually ranged from 1 to 7 days, depending on the specific GPU and model pair (which affected
convergence rates). Partial convergence was stopped after 2 days. Due to the size of Qwen, our (qwen, gte) ablation
was trained for 20 days on an A100. Taking a conservative estimate of the average training time, this amounted to
approximately 176 GPU days (24 models × 4 days / model + 30 models × 2 days / model + 1 (qwen, gte) × 20 days /
model).

Evaluation procedures varied by model type:

     •
     The 10 main vec2vec models required ∼1 hour each for NQ, TweetTopic, and MIMIC evaluation (across GPU
     types), plus 30 minutes for attribute extraction on TweetTopic and MIMIC, and 1.5 hours for inversion and
     downstream LLM evaluation on Enron and TweetTopic. Naive baselines required ∼30 minutes each across all
     datasets.

     •
     The 15 additional fully-trained models required 30 minutes each for NQ evaluation, with an extra 30 minutes for
     MS COCO evaluation of (clip, granite).

     •
     Optimal transport baselines ran on CPU only, requiring ∼1 hour per dataset (three datasets for main models, one
     for others).

In total, our experiments consumed almost 176 GPU days for training and an additional 42 GPU hours for evaluation
and analysis. An additional 45 CPU hours were required for optimal transport.


Appendix B Oracle-aided optimal transport baseline
Let 𝑢𝑖 = 𝑀1 ​(𝑑𝑖 ) and 𝑣𝑖 = 𝑀2 ​(𝑑𝑖 ) denote embeddings of the same document 𝑑𝑖 from two different embedding models. In
Section˜5, we solve the optimal assignment problem:
                𝑛
𝜋∗ = arg ⁡min​ ∑ cos⁡(𝑢𝑖 , 𝑣𝜋​(𝑖) ),
            𝜋 𝑖=1
using four algorithms: Hungarian (linear sum assignment), Earth Mover’s Distance (EMD), Sinkhorn, Gromov-
Wasserstein. For the Gromov-Wasserstein algorithm, we try both the entropic and non-entropic variants with multiple
hyperparameter configurations and select the best figure. Note that the optimal transport (OT) baseline computes
matchings and transports between embeddings derived from the same underlying texts, strongly favoring OT
methods. Nevertheless, OT still struggles when embeddings originate from different model backbones.

Since the Hungarian algorithm produces a discrete matching, it is evaluated only using Top-1 Accuracy, while the
other algorithms are evaluated across all metrics. For each experiment, the lowest-rank solver is reported in Table˜2
and Table˜4 (denoted by symbols in the final column). Evaluation metrics are defined as follows:

      1.
      Top-1 Accuracy: Fraction of embeddings correctly identified as closest pairs, calculated by either selecting the
      maximum transported mass per embedding or applying the Hungarian algorithm directly to the transport plan 𝑃.
      We report the higher accuracy between the two.

      2.
      Mean Rank: Average rank position of the correct embedding match 𝑣𝑖 when sorted by descending transported
      mass 𝑃𝑖𝑗 from 𝑢𝑖 :

      rank(𝑣𝑖 ) = position of 𝑣𝑖 among sorted 𝑃𝑖​𝑗 .
      3.
      Mean Cosine Similarity: Average cosine similarity between barycenters and true counterparts:

              ∑𝑛𝑗 = 1 𝑃𝑖​𝑗 𝑣𝑗                         𝑛
      𝑣′𝑖 =                     ,   Similarity = 1𝑛 ​ ∑ cos⁡(𝑣′𝑖 , 𝑣𝑖 ).
                ∑𝑛𝑗 = 1 𝑃𝑖​𝑗                        𝑖=1



Appendix C Translating to and from Qwen
         vec2vec                    OT Baseline
𝑀1   𝑀2  cos(⋅ ) ↑ T-1 ↑ Rank ↓ cos⁡(⋅ ) ↑ T-1 ↑ Rank ↓
gte qwen 0.50 (0.0) 0.92 2.28 (0.2) 0.38 (0.0) 0.00 425.28 (1.1) ‡
qwen gte 0.84 (0.0) 0.88 2.49 (0.3) 0.85 (0.0) 0.00 425.07 (1.2) ‡
Table 8: Translations between GTE and Qwen embeddings trained on NQ and evaluated on a 65536 text subset of NQ (chunked in
batches of size 1024). Rank varies from 1 to 1024, thus 512 corresponds to a random ordering. Since the embedding
dimensionalities are different, only the Gromov-Wasserstein‡ OT baseline is run and the naive baseline does not apply. Bold
denotes best value.

As shown in Table˜8, vec2vec successfully translates between GTE and Qwen, significantly outperforming the
optimal transport baseline in all metrics except qwen → gte cosine similarity, which we hypothesize may be due to
the substantial performance gap between the models—indeed, Qwen differs from GTE in architecture (dense Qwen
backbone), training methodology (unsupervised + model merging techniques), size (14 × larger than the next largest
model and 37 × larger than GTE), context length, and recency. Given Qwen’s size and computational cost, we only
evaluated this representative pair. We leave further evaluation to future work.


Appendix D Text-image retrieval on MS COCO
model           R@16 ↑ cos⁡(⋅ ) ↑ Rank ↓
granite → clip 0.23    0.23 (0.0) 233.67 (3.0)
clip (baseline) 0.75   0.30 (0.0) 23.20 (0.8)
Table 9: Cross-model text-image retrieval on MS COCO: granite → clip vec2vec trained on NQ (unimodal) and evaluated on MS
COCO’s validation set. The rank metric varies from 1 to 5000, thus 2500 corresponds to a random ordering. Queries (captions)
embedded with either Granite or CLIP. Documents (images) embedded with CLIP. Each caption has a unique image. Standard
errors are shown in parentheses.

Our vec2vecs can “stitch" modalities onto unimodal models by translating to a multimodal model. To test this, we
evaluated cross-modal text-image retrieval on MS COCO’s validation set (5000 examples) [undefag], translating
queries (captions) embedded with Granite to retrieve documents (images) embedded with CLIP using our unimodal
granite → clip translator from section˜4.3. Each caption has a unique image. We report Recall@16, cosine
similarities, and Rank, with CLIP (for both documents and queries) as our baseline.

As Table˜9 shows, translating Granite embeddings to CLIP enables non-negligible cross-model multimodal retrieval
with a unimodal model for queries—despite zero multimodal training. Further evaluation of this paradigm with
multimodal-specific training is a promising direction.


Appendix E Initialization robustness by model backbone
GAN training is notoriously unstable to weight initialization [undefaz]. To measure our method’s robustness, we
trained fifteen e5 → gte (shared backbone) and e5 → gtr (cross-backbone) vec2vecs on the NQ dataset for a fixed
10 epochs.

For the translations between related models, vec2vec training was relatively stable across random seeds: 14 out of 15
seeds achieved at least 80% top-1 accuracy within a fixed epoch budget, while the remaining run reached 72%. In
contrast, translation between unrelated models proved significantly less stable, with only 3 out of 15 runs achieving
convergence (80% top-1 accuracy). We leave improving the seed stability of our training regime as future, valuable
work.


Appendix F Full out-of-distribution translation results
We provide baseline numbers for the experiments shown in Table˜3, by dataset.

          vec2vec                    Naïve Baseline                OT Baseline
𝐸 1 𝐸 2 cos(⋅ ) ↑ T-1 ↑ Rank ↓ cos⁡(⋅ ) ↑ T-1 ↑ Rank ↓ cos⁡(⋅ ) ↑ T-1 ↑ Rank ↓
     gtr 0.74 (0.0) 0.99 1.09 (0.1) -0.04 (0.0) 0.00 415.61 (8.2) 0.71 (0.0) 0.01 220.93 (7.1) ‡
     gte 0.85 (0.0) 0.95 1.26 (0.1) 0.00 (0.0) 0.00 406.73 (8.2) 0.87 (0.0) 0.01 201.48 (6.6) ‡
gra.
     ste. 0.77 (0.0) 0.96 1.11 (0.0) 0.00 (0.0) 0.00 417.27 (8.2) 0.74 (0.0) 0.00 239.36 (6.7) ‡
     e5 0.83 (0.0) 0.87 3.10 (0.7) 0.02 (0.0) 0.00 405.53 (8.1) 0.87 (0.0) 0.01 244.94 (7.4)‡
     gra. 0.79 (0.0) 0.98 2.41 (0.6) -0.04 (0.0) 0.00 411.53 (8.3) 0.57 (0.0) 0.01 398.29 (8.2)‡
     gte 0.85 (0.0) 0.96 1.29 (0.2) 0.04 (0.0) 0.00 392.01 (8.2) 0.86 (0.0) 0.01 259.47 (7.4)‡
gtr
     ste. 0.77 (0.0) 0.96 1.10 (0.0) 0.00 (0.0) 0.00 394.69 (8.3) 0.74 (0.0) 0.00 294.58 (7.4)‡
     e5 0.80 (0.0) 0.53 13.38 (1.2) 0.03 (0.0) 0.00 400.85 (8.2) 0.87 (0.0) 0.01 266.04 (7.7) ‡
     gra. 0.73 (0.0) 0.94 1.33 (0.1) 0.00 (0.0) 0.00 408.81 (8.3) 0.56 (0.0) 0.01 398.16 (8.2) ∗
     gtr 0.71 (0.0) 0.95 1.29 (0.1) 0.04 (0.0) 0.00 386.58 (8.3) 0.71 (0.0) 0.01 254.74 (7.3) ‡
gte
     ste. 0.86 (0.0) 1.00 1.00 (0.0) 0.58 (0.0) 1.00 1.00 (0.0) 1.00 (0.0) 1.00 1.00 (0.0) ∗
     e5 0.83 (0.0) 0.91 1.57 (0.2) 0.68 (0.0) 1.00 1.00 (0.0) 1.00 (0.0) 1.00 1.00 (0.0)∗
     gra. 0.79 (0.0) 0.99 1.09 (0.1) 0.00 (0.0) 0.00 418.16 (8.4) 0.57 (0.0) 0.00 399.56 (8.2)‡
     gtr 0.77 (0.0) 1.00 1.00 (0.0) 0.00 (0.0) 0.00 393.07 (8.1) 0.71 (0.0) 0.00 294.65 (7.4)‡
ste.
     gte 0.90 (0.0) 1.00 1.00 (0.0) 0.58 (0.0) 1.00 1.00 (0.0) 1.00 (0.0) 1.00 1.00 (0.0)∗
     e5 0.85 (0.0) 0.98 1.05 (0.0) 0.37 (0.0) 0.89 1.55 (0.1) 1.00 (0.0) 1.00 1.00 (0.0) ∗
     gra. 0.79 (0.0) 0.98 1.08 (0.0) 0.02 (0.0) 0.00 405.75 (8.3) 0.57 (0.0) 0.01 398.34 (8.2) ‡
     gtr 0.67 (0.0) 0.80 3.10 (0.6) 0.03 (0.0) 0.00 401.16 (8.4) 0.71 (0.0) 0.00 268.28 (7.6) ‡
e5
     gte 0.87 (0.0) 0.99 1.02 (0.0) 0.68 (0.0) 1.00 1.00 (0.0) 1.00 (0.0) 1.00 1.00 (0.0) ∗
     ste. 0.75 (0.0) 0.98 1.06 (0.0) 0.37 (0.0) 1.00 1.00 (0.0) 1.00 (0.0) 1.00 1.00 (0.0)∗
Table 10: Out-of-distribution translations on TweetTopic (with baselines): vec2vec models trained on NQ and evaluated on the
entire TweetTopic test set (800 tweets). The rank metric varies from 1 to 800, thus 400 corresponds to a random ordering.
Standard errors are shown in parentheses. Symbols denote the lowest-rank solver: Earth Mover’s Distance∗ and Gromov-
Wasserstein‡

          vec2vec                      Naïve Baseline                  OT Baseline
𝐸 1 𝐸 2 cos(⋅ ) ↑ T-1 ↑ Rank ↓         cos⁡(⋅ ) ↑ T-1 ↑ Rank ↓         cos⁡(⋅ ) ↑ T-1 ↑ Rank ↓
     gtr 0.74 (0.0) 0.60 23.38 (1.6)   -0.02 (0.0) 0.00 4010.00 (25.8) 0.82 (0.0) 0.00 3962.83 (26.1) †
     gte 0.85 (0.0) 0.08 346.21 (7.8) 0.01 (0.0) 0.00 3978.35 (26.1) 0.92 (0.0) 0.00 3808.18 (25.9) †
gra.
     ste. 0.72 (0.0) 0.13 242.23 (6.1) -0.01 (0.0) 0.00 3900.74 (26.2) 0.86 (0.0) 0.02 3780.44 (26.0)†
     e5 0.84 (0.0) 0.12 361.06 (8.7) 0.02 (0.0) 0.00 4024.92 (26.1) 0.93 (0.0) 0.00 3937.63 (26.2)†
     gra. 0.78 (0.0) 0.51 35.27 (1.9)  -0.02 (0.0) 0.00 4023.67 (26.1) 0.87 (0.0) 0.00 3964.83 (26.1)†
     gte 0.84 (0.0) 0.12 279.56 (6.9) 0.08 (0.0) 0.00 4180.47 (26.2) 0.87 (0.0) 0.00 4088.97 (26.2)‡
gtr
     ste. 0.72 (0.0) 0.27 127.92 (4.4) 0.00 (0.0) 0.00 4296.04 (26.1) 0.76 (0.0) 0.00 4095.11 (26.1)‡
     e5 0.82 (0.0) 0.01 1413.80 (18.3) 0.09 (0.0) 0.00 4064.47 (26.2) 0.93 (0.0) 0.00 4010.13 (26.1) †
     gra. 0.73 (0.0) 0.09 342.15 (7.8) 0.01 (0.0) 0.00 3946.19 (25.8) 0.87 (0.0) 0.00 3802.92 (25.9) †
     gtr 0.69 (0.0) 0.12 256.63 (6.4) 0.08 (0.0) 0.00 4229.90 (26.2) 0.69 (0.0) 0.00 4094.02 (26.1) ‡
gte
     ste. 0.85 (0.0) 1.00 1.00 (0.0)   0.56 (0.0) 1.00 1.00 (0.0)      1.00 (0.0) 1.00 1.00 (0.0)∗
     e5 0.86 (0.0) 0.54 17.71 (0.9)    0.69 (0.0) 0.98 1.04 (0.0)      1.00 (0.0) 1.00 1.00 (0.0)∗
        vec2vec                           Naïve Baseline                   OT Baseline
𝐸 1 𝐸 2 cos ⋅ ↑ T-1 ↑ Rank ↓              cos ⋅ ↑ T-1 ↑ Rank ↓             cos ⋅ ↑ T-1 ↑ Rank ↓
     gra. 0.77 (0.0) 0.14   221.95 (5.9) -0.01 (0.0) 0.00    3951.42 (25.9) 0.87 (0.0) 0.01   3776.52 (26.0)†
     gtr 0.75 (0.0) 0.56    17.70 (1.0)    0.00 (0.0) 0.00   4339.83 (26.2) 0.70 (0.0) 0.00   4093.61 (26.1)‡
ste.
     gte 0.91 (0.0) 1.00    1.00 (0.0)     0.56 (0.0) 1.00   1.00 (0.0)     1.00 (0.0) 1.00   1.00 (0.0)∗
     e5 0.85 (0.0) 0.51     26.33 (1.2)    0.35 (0.0) 0.59   12.68 (0.6)    0.93 (0.0) 1.00   1.00 (0.0)†
     gra. 0.78 (0.0) 0.21   151.09 (4.6) 0.02 (0.0) 0.00     4008.10 (25.9) 0.87 (0.0) 0.00   3932.58 (26.2)†
     gtr 0.66 (0.0) 0.01    1029.64 (14.9) 0.09 (0.0) 0.00   4032.85 (26.2) 0.82 (0.0) 0.00   4010.06 (26.1)†
e5
     gte 0.87 (0.0) 0.60    32.59 (2.6)    0.69 (0.0) 0.98   1.09 (0.0)     1.00 (0.0) 1.00   1.00 (0.0) ∗
     ste. 0.75 (0.0) 0.46   32.12 (1.4)    0.35 (0.0) 0.86   2.49 (0.1)     0.86 (0.0) 1.00   1.01 (0.0)†
Table 11: Out-of-distribution translations on MIMIC (with baselines): vec2vec models trained on NQ and evaluated on an 8192-
record subset of MIMIC. The rank metric varies from 1 to 8192, thus 4096 corresponds to a random ordering. Standard errors are
shown in parentheses. Symbols denote the lowest-rank solver: Earth Mover’s Distance∗, Sinkhorn† and Gromov-Wasserstein‡


Appendix G Zero-shot inversion on TweetTopic
   Refer to caption




Figure 7: Leakage of information via inversion. Trained on NQ and evaluated on a 50-tweet subset of the TweetTopic dataset. Cells
denote judge accuracy.

We replicate Figure˜5 on the TweetTopic dataset in Figure˜7, extracting information given only translated embeddings
of tweets. We achieve non-negligible leakage for all model pairs.


Appendix H Prompt for measuring information extraction
Figures˜5 and 7 utilize an LLM judge to determine whether the approximate inversion (using [undefaan]) of a
translated email embedding leaks information about the original email. Figure˜8 shows our prompt to the GPT-4o
judge:
 Original email: {ground_truth} Reconstructed email: {generation}. Does the
 reconstructed email leak any information about the original email? Answer with
 only ‘yes’ or ‘no’.




Figure 8: The prompt given to the LLM judge.


 Report Issue
Generated by LATExml

Instructions for reporting errors
We are continuing to improve HTML versions of papers, and your feedback helps enhance accessibility and mobile
support. To report errors in the HTML that will help us improve conversion and rendering, choose any of the methods
listed below:

    Click the "Report Issue" button.
    Open a report feedback form via keyboard, use "Ctrl + ?".
    Make a text selection and click the "Report Issue for Selection" button near your cursor.
    You can use Alt+Y to toggle on and Alt+Shift+Y to toggle off accessible reporting links at each section.

Our team has already identified the following issues. We appreciate your time reviewing and reporting rendering
errors we may not have found yet. Your efforts will help us improve the HTML versions for all readers, because
disability should not be a barrier to accessing research. Thank you for your continued support in championing open
access for all.

Have a free development cycle? Help support accessibility at arXiv! Our collaborators at LaTeXML maintain a list of
packages that need conversion, and welcome developer contributions.
