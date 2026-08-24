---
source_file: journal.pcbi.1012149.pdf
source_format: pdf
converted_at: 2026-08-23T22:24:39.792315
---

PLOS COMPUTATIONAL BIOLOGY


                                                   RESEARCH ARTICLE

                                                   Revealing non-trivial information
                                                   structures in aneural biological tissues via
                                                   functional connectivity
                                                   Douglas Blackiston 1,2,3,4¤ , Hannah Dromiack 5,6¤ , Caitlin Grasso7¤ , Thomas F.
                                                   Varley 7,8,9 , Douglas G. Moore6,10 , Krishna Kannan Srinivasan7,8 , Olaf Sporns11 ,
                                                   Joshua Bongard3,7 , Michael Levin1,2,3,4 , Sara I. Walker 6,12,13 ∗

                                                   1 Allen Discovery Center, Tufts University, Medford, Massachusetts, United States of America, 2 Wyss
                                                   Institute for Biologically Inspired Engineering, Harvard University, Boston, Massachusetts, United States
                                                   of America, 3 Institute for Computationally-Designed Organisms, UVM, Burlington, Vermont and Tufts,
                                                   Medford, Massachusetts, United States of America, 4 Department of Biology, Tufts University, Medford,
                                                   Massachusetts, United States of America, 5 Department of Physics, Arizona State University, Tempe,
                                                   Arizona, United States of America, 6 BEYOND Center for Fundamental Concepts in Science, Arizona
                                                   State University, Tempe, Arizona, United States of America, 7 Department of Computer Science,
                                                   University of Vermont, Burlington, Vermont, United States of America, 8 Department of Complex Systems
                                                   and Data Science, University of Vermont, Burlington, Vermont, United States of America, 9 School of
                                                   Informatics, Computing, and Engineering, Indiana University, Bloomington, Indiana, United States of
                                                   America, 10 Alpha 39 Research, Tempe, Arizona, United States of America, 11 Department of
                                                   Psychological and Brain Sciences, Indiana University, Bloomington, Indiana, United States of America,
   OPEN ACCESS                                     12 School of Earth and Space Exploration, Arizona State University, Tempe, Arizona, United States of
                                                   America, 13 Santa Fe Institute, Santa Fe, New Mexico, United States of America
Citation: Blackiston D, Dromiack H, Grasso C,
Varley TF, Moore DG, Srinivasan KK. et al.         ¤ These authors contributed equally to this work.
(2025) Revealing non-trivial information           ∗ sara.i.walker@asu.edu

structures in aneural biological tissues via
functional connectivity. PLoS Comput Biol
21(4): e1012149. https://doi.org/10.1371/
journal.pcbi.1012149                               Abstract
Editor: Joanna Jędrzejewska-Szmek, Instytut        A central challenge in the progression of a variety of open questions in biology, such
Biologii Doswiadczalnej im M Nenckiego
                                                   as morphogenesis, wound healing, and development, is learning from empirical data
Polskiej Akademii Nauk, POLAND
                                                   how information is integrated to support tissue-level function and behavior. Information-
Received: May 9, 2024
                                                   theoretic approaches provide a quantitative framework for extracting patterns from data,
Accepted: February 19, 2025                        but so far have been predominantly applied to neuronal systems at the tissue-level. Here,
Published: April 14, 2025                          we demonstrate how time series of Ca2+ dynamics can be used to identify the struc-
Copyright: © 2025 Blackiston et al. This is an
                                                   ture and information dynamics of other biological tissues. To this end, we expressed
open access article distributed under the terms    the calcium reporter GCaMP6s in an organoid system of explanted amphibian epider-
of the Creative Commons Attribution License,       mis derived from the African clawed frog Xenopus laevis, and imaged calcium activity
which permits unrestricted use, distribution,
                                                   pre- and post- a puncture injury, for six replicate organoids. We constructed functional
and reproduction in any medium, provided the
original author and source are credited.           connectivity networks by computing mutual information between cells from time series
                                                   derived using medical imaging techniques to track intracellular Ca2+ . We analyzed net-
Data availability statement: Code and videos
for the analyses described herein is publicly      work properties including degree distribution, spatial embedding, and modular structure.
available at: https:                               We find organoid networks exhibit potential evidence for more connectivity than null mod-
//github.com/caitlingrasso/bio-connectivity.git.   els, with our models displaying high degree hubs and mesoscale community structure
Funding: This research was sponsored by the        with spatial clustering. Utilizing functional connectivity networks, our model suggests
Defense Advanced Research Projects Agency          the tissue retains non-random features after injury, displays long range correlations and
(DARPA) under Cooperative Agreement No.
                                                   structure, and non-trivial clustering that is not necessarily spatially dependent. In the con-
HR0011-180200022, Grant No. DOD060 (to JB,
ML, and SIW), the Lifelong Learning Machines       text of this reconstruction method our results suggest increased integration after injury,



PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149           April 14, 2025                                                       1/ 23
PLOS COMPUTATIONAL BIOLOGY                                                        Revealing non-trivial information structures in aneural biological tissues




program from DARPA/MTO. The content of the
                                                   possible cellular coordination in response to injury, and some type of generative struc-
information does not necessarily reflect the       ture of the anatomy. While we study Ca2+ in Xenopus epidermal cells, our computational
position or policy of the government, and no       approach and analyses highlight how methods developed to analyze functional connec-
official endorsement should be inferred.
                                                   tivity in neuronal tissues can be generalized to any tissue and fluorescent signal type.
Approved for public release; distribution is
unlimited. This research was also supported by     We discuss expanded methods of analyses to improve models of non-neuronal informa-
the Allen Discovery Program through the Alfred     tion processing highlighting the potential of our framework to provide a bridge between
P. Sloan Foundation Matter-to-Life program         neuroscience and more basal modes of information processing.
Grant No. G-2021-16495 (to JB and ML).
Additionally, this material is based upon work
supported by the National Science Foundation
Graduate Research Fellowship Program under
Grant No. 1842491 (to CG). Any opinions,
findings, and conclusions or recommendations
expressed in this material are those of the          Author summary
author(s) and do not necessarily reflect the
views of the National Science Foundation. We         A central challenge in understanding several diverse processes in biology, including
also acknowledge support from Army Research          morphogenesis, wound healing, and development, is learning from empirical data how
Office contract No. W911NF-23-1-0327 (to JB).        information is integrated to support tissue-level function and behavior. Significant
Finally, we gratefully acknowledge the support       progress in understanding information integration has occurred in neuroscience via the
of Grant 62212 from the John Templeton
                                                     use of observable live calcium reporters throughout neural tissues. However, these same
Foundation (to ML). The opinions expressed in
this publication are those of the author(s) and      techniques have seen limited use in non-neural tissues of multicellular organisms despite
do not necessarily reflect the views of the John     similarities in tissue communication. Here we utilize methods designed for neural tissues
Templeton Foundation. The funders had no role        and modify them to work on any tissue type, demonstrating how non-neural tissues
in study design, data collection and analysis,       may also contain non-random and potentially meaningful structures to be gleaned from
decision to publish, or preparation of the
                                                     information theoretic approaches. In the case of epidermal tissue derived from develop-
manuscript.
                                                     ing amphibians, we find potential evidence of non-trivial informational structure over
Competing interests: The authors have                greater spatial and temporal scales than those found in neural tissue. This hints at how
declared that no competing interests exist.
                                                     more exploration into information structures within these tissue types, including apply-
                                                     ing more advanced methods on larger datasets, could provide a deeper understanding
                                                     into information processing within living systems beyond the nervous system.


                                                   Introduction
                                                   Information and its processing are widely accepted to play a central role in biological func-
                                                   tion [1–5]. This critical role is particularly important in understanding the function of neu-
                                                   ronal tissues, and as such, information theoretic approaches have seen wide-spread adop-
                                                   tion as quantitative tools in neuroscience [6]. Insights into neuronal function from these
                                                   approaches include collective decision-making by groups of neurons, how long-range correla-
                                                   tions are structured across neural networks, and the structure of phase transitions in networks
                                                   of neurons to name a few [7–10]. However, communication and information processing are
                                                   not exclusive to populations of neurons: these are embodied processes throughout the cel-
                                                   lular architectures of multicellular life [11,12]. Yet, the application of information theoretic
                                                   approaches has seen limited development towards a universally implementable approach to
                                                   quantify general tissue function and behavior to understand the role of information in other
                                                   tissue types beyond neuronal examples [13–16].
                                                       In multicellular systems, cells must collectively coordinate their actions to regulate the
                                                   diverse range of processes essential to multicellular life: these include regulation of pat-
                                                   tern formation in development, morphogenesis, wound healing, regeneration, and behavior
                                                   among others. Communication and information sharing can even extend beyond species-
                                                   specific boundaries, as is the case for plant-animal interactions and in symbiotic associations



PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149       April 14, 2025                                                          2/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            like lichen where multiple species are in direct coordinated communication. Historically, bio-
                                            logical science techniques have focused on measuring the activation of some system, such as
                                            via multielectrode arrays [17,18], planar cell polarity analysis [19,20], physiological reporter
                                            dyes [21], immunohistochemistry [22], and RNAseq [23,24]. These have provided important
                                            methods for gaining insight into specific cellular function, such as, neural voltages at various
                                            cell stages, alignment, and coordination of cells within a tissue plane, distribution and local-
                                            ization of biomarkers, and global ligand and receptor interactions [25]. However, activation
                                            of single elements presents a limited view of collective, systemic organization. An open chal-
                                            lenge is capturing the longer temporal and spatial scales necessary to characterize information
                                            processing associated with collective behavior and coordinated decision making across entire
                                            tissues and whole multicellular organismal systems.
                                                One approach available to capture these longer-range dynamics is provided by functional
                                            connectivity (FC) networks derived from information theoretic analyses of signal data. These
                                            networks provide a quantitative framework for identifying connections and information flow
                                            over spatial and temporal scales relevant to the coordinated function of entire tissues [26].
                                            FC networks are weighted, undirected networks generated based on instantaneous statistical
                                            correlations, or statistical dependencies, between activity in different areas of a system. They
                                            are often employed in the field of neuroscience to quantify temporal correlations in activ-
                                            ity between different regions of the brain, as in the case of correlated neural firing between
                                            regions of the brain which can reveal correlated behavior, even if the regions are spatially
                                            separated [27,28]. Information theory provides a set of mathematical tools to quantify such
                                            correlations, where measures such as mutual information [29] and transfer entropy [30]
                                            applied across temporally sampled data can be used to construct FC networks that capture
                                            nonlinearities and structure not apparent in static images. A predecessor and contempo-
                                            rary approach to constructing FC networks is anatomical connectivity maps, which focuses
                                            on physical tracts that can reveal direct anatomical links between different physical regions
                                            in a tissue. However, these do not capture the long range temporally correlated structures,
                                            which need not be in direct physical contact, which are revealed in FC networks. There-
                                            fore, we adopt the approach utilized in the study of networks of neurons to develop applica-
                                            tions of the same kind for implementation to other multicellular tissues. We anticipate such
                                            studies will provide a complement to existing approaches, by allowing a new window into
                                            understanding tissue function through understanding FC over longer spatial and temporal
                                            scales.
                                                A commonly used signaling molecule is Ca2+ , which is found across nearly all living sys-
                                            tems. Ca2+ is held both inter- and intra-cellularly and can be used for tracking rapid phys-
                                            iological responses to a wide range of events [31,32]. Tracking Ca2+ across a tissue sam-
                                            ple therefore provides the opportunity for better understanding information flow and use
                                            at the level of cellular networks, including cellular communication and information trans-
                                            fer in the context of basal and perturbed states [33,34]. Indeed, fluorescent reporters of
                                            Ca2+ are now widely used within neuroscience to track and quantify cellular function and
                                            have formed the foundation of information theoretic analyses to understand information
                                            processing in neuronal networks [35,36]. Ca2+ is also known to regulate epithelium heal-
                                            ing across diverse model species (fish, chick, frog, mouse, human) [37–40], though most
                                            work to date has focused on rapid events (milliseconds to seconds) such as at the time of
                                            wounding or neuron firing. Due to this limited observational limit it is not known if long
                                            range events exist and/or contribute to the informational structure in a tissue. Herein, we
                                            demonstrate evidence of such long-range correlations via FC networks, which suggest in
                                            our system either has a storage of memory or long-range coordination of cells in wound
                                            healing.



PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                          3/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                                To explore information processing and its relation to function in a non-neural tissue, we
                                            expressed mRNA encoding the calcium reporter GCaMP6s in an organoid system of embry-
                                            onic explanted amphibian epidermis derived from the African clawed frog Xenopus laevis [41,
                                            42]. This modified self-assembling system, composed of the developing epidermal cells, was
                                            selected for its well characterized cell types and diverse uses in self-organization, cell polar-
                                            ity, stem-cell differentiation, wound healing, human pulmonary disease, and biomaterial
                                            science [43–50]. To show an explicit example of tracking whole tissue-level behavior using
                                            these approaches, our primary focus is on how cellular networks respond to perturbation by
                                            inducing a mechanical puncture wound. Using techniques developed for medical imaging,
                                            we stabilize videos of recorded organoids and track intracellular Ca2+ over time. From these
                                            time series, we construct FC networks using bivariate mutual information between cells to
                                            infer internal informational structure in the tissue. Topological and communicational prop-
                                            erties of the networks, such as mesoscale community structure, degree distribution, and spa-
                                            tial embedding, were characterized to approach better understanding how epidermal cells
                                            respond to perturbation, and what controlling parameters are retained by cellular communi-
                                            ties isolated from their host. We find potential evidence Xenopus ex-vivo tissue self-organizes
                                            into non-trivial informational structures that can serve as proxies for the intact organism, dis-
                                            playing a pronounced mesoscale network topology. Furthermore, the organization of the tis-
                                            sue is flexible, restructuring itself in response to the puncture and thereby demonstrating a
                                            dynamic response to wounding. While we focus on the application of these methods to epi-
                                            dermal tissue herein, our intent is to demonstrate how this and related approaches are gen-
                                            eralizable to any tissue type and fluorescent signal. In what follows, we outline the process of
                                            generating the FC networks, review what structures they reveal, and discuss the future direc-
                                            tions for using information theory to uncover larger scale temporal and spatial functional
                                            structure in multicellular tissues.

                                            Results
                                            Constructing functional connectivity networks using experimental data
                                            derived from multicellular tissues
                                            To examine the informational structure of a non-neuronal tissue, we tracked calcium tran-
                                            sience in a vertebrate model of wound healing, using developing Xenopus laevis embryos as
                                            our source material. At the Nieuwkoop and Faber stage 2 (4-cell stage, Fig 1A), each of the 4
                                            cells were injected with two mRNA transcripts, one encoding the fluorescent calcium indi-
                                            cator GCaMP6s, the other encoding the intracellular domain of the notch protein (Notch
                                            ICD) to inhibit motile-cilia formation on the developing epidermis [51–54]. Knockdown of
                                            motile cilia was necessary to prevent rotational movement of the organoid which complicates
                                            downstream image registration efforts. After 24 hours of development at 14 ○ C, the animal
                                            cap of the embryo was excised manually with surgical forceps (Fig 1B, red circle) and cul-
                                            tured in a saline media. Following an additional 24 hours of development (Fig 1C), the devel-
                                            oping spheroid of tissue can be left untreated or compressed (Fig 1D) to produce a flattened
                                            morphology amenable to 2D fluorescent microscopy.
                                                Calcium imaging was performed 7 days post-fertilization, at which time the epidermal
                                            organoid was fully differentiated, containing 3 distinct cell types on the surface: mucus pro-
                                            ducing goblet cells, small secretory cells, and ionocytes [43,44,55]. Preliminary studies found
                                            that a capture rate of 1 frame per 5 seconds was sufficient to identify individual calcium
                                            flashes across the surface of the tissue without inducing phototoxicity. Individual frames of
                                            the timelapse dataset (Fig 1E) were subtracted from subsequent frames in the stack (Fig 1F)
                                            to identify cells presenting calcium flashes (Fig 1G, 1H). This imaging setup was found to



PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                          4/ 23
PLOS COMPUTATIONAL BIOLOGY                                                         Revealing non-trivial information structures in aneural biological tissues




                                            Fig 1. Long-term calcium transience in vertebrate epithelium in the basal state and following injury. A: 4-cell
                                            stage of embryonic development, B: animal cap excised after 24 hours, C: spheroid tissue after another 24 hours,
                                            and D: compressed spheroid tissue into disk. 7 days post-fertilization calcium imaging was performed, E: Individual
                                            frame of calcium intensity, F: average intensity of stacked frames, G and H: Cell identification. I and J: experimental
                                            setup where the tissue is punctured with a glass capillary. K: Kymograph analysis was performed on the explant out-
                                            side the conventional timescale (on the order of milliseconds), because it is only when the timescale is on the order of
                                            thousands of seconds when new structures are observed within the tissue. What these structures represent requires
                                            further investigations beyond the scope of kymograph analysis. Calcium transience within these tissues displays more
                                            diverse structures when longer timescales are observed.
                                            https://doi.org/10.1371/journal.pcbi.1012149.g001



                                            be stable over the duration of 10–20 minutes. The experimental setup consisted of 20 min-
                                            utes of organoid imaging in its basal state, preceded by a centrally located puncture wound
                                            delivered via a pulled glass capillary, followed by an additional 20 minutes of organoid imag-
                                            ing during wound resolution (Fig 1I, 1J). A total of 6 organoids were imaged in the exper-
                                            imental setup, all at 7 days of development, to reduce age related variance in downstream
                                            analysis.
                                               Kymographs are frequently utilized to visualize calcium topography following wound-
                                            ing, as time is represented as a dimensional axis. When employed on the organoid injury
                                            dataset, systemic calcium activation is readily observed, and resolved, over the course of
                                            100s (Fig 1Ki, ii, red box). The sharp transition noted at 0s (Fig 1Kii) is an artifact of imag-
                                            ing, as the time series omitted the moment of puncture when the needle occluded the optics,
                                            and re-centering the sample was necessary following injury. This method proved sufficient




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149       April 14, 2025                                                                  5/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            to capture the large-scale calcium changes in direct response to injury, matching previ-
                                            ous reports of lacerations in the same system [56]. Interestingly, when kymographs were
                                            expanded beyond the standard time frame convention prior and post injury by the order
                                            of thousands of seconds, different structures could be observed in the data in the form
                                            of less frequent flashes by individual cells (Fig 1Kii, teal arrows). This is the first evidence
                                            of non-trivial long-range correlations within the informational structures of non-neural
                                            tissues.
                                                Statistical analyses of these flashes to determine structure is limited in kymograph repre-
                                            sentations, due to the nature of the linear slices used in the method (Fig 1Ki, teal line) which
                                            occluded the less frequent signals. Thus, to analyze this data for more complex information
                                            structures prior to, and post injury, FC maps were utilized for whole-image analysis. We
                                            therefore performed a coarse-grained analysis and visual inspection of the global calcium sig-
                                            nal, which revealed a sharp increase in signal at the time of puncture (t = 0s in Fig 2A, 2B).
                                            The signal remained high and unstable for a period following puncture, which varied in dura-
                                            tion across organoid samples. During this time, organoids shifted in position due to force
                                            imparted from the glass capillary. These movements were too great to correct for using con-
                                            ventional image registration software and were thus excised from the video. Resulting in the
                                            generation of two distinct videos per organoid; one capturing the basal state behavior prior
                                            to puncture damage (pre- puncture) and the other capturing behavior post damage once the
                                            organoid had settled (post- puncture). Pre- and post- puncture videos were processed and ana-
                                            lyzed independently. Smaller translational and rotational movements between frames were
                                            corrected using ANTs image registration software in Julia [58]. After organoid alignment,
                                            temporal averaging of the images was used to produce a representative image that could be
                                            supplied to the deep learning cell segmentation model, Cellpose (Fig 2C, 2G) [59]. Prelim-
                                            inary experiments explored optimal model parameters for each organoid, however, perfor-
                                            mance was highly dependent on image quality. Models performed suboptimal in regions that
                                            were out of focus and/or of high fluorescent intensity where cell boundaries were obscured.
                                            Thus, the segmented cells identified were spread non-uniformly across the organoid. Pixel
                                            intensities within each identified cell boundary were extracted and averaged in each frame
                                            to produce a time series of calcium readings localized to individual cells at every time step
                                            (Fig 2D, 2H).
                                                Some common problems in analyses such as these arise in managing global artifacts.
                                            Global artifacts, observed in many organoids, include the steady decline in signal at the begin-
                                            ning of pre- and post- puncture videos. To remove this, global signal regression (GSR) is used;
                                            the global signal, acquired by taking the average of all cells’ time series, is subtracted from
                                            each cell’s individual time series. Additionally the time series were transformed into a fea-
                                            ture vector [57] by computing the local conditional entropy rate, a measure of instantaneous
                                            information that cannot be learned from observing a cell’s own past signals [60,61]. This fea-
                                            ture transformation was done to highlight those moments of activity that are unlikely to be
                                            attributable to the first-order dynamics of the system: instead, they must either come from
                                            intrinsic randomness, or (relevant to functional connectivity analysis) from perturbations by
                                            other cells. These preprocessing steps produce flattened time series with emphasized flashes
                                            where there are changes in signal that deviate from the first-order trend, or a global artifact
                                            (Fig 2E, 2I). Here, FC is computed as the temporal correlation in activity between pairs of
                                            identified cells where correlation is measured as non-zero significant mutual information and
                                            activity refers to intensities localized to individual cells. This translates to how much informa-
                                            tion the flashing pattern of one cell discloses about that of other cells; high functional con-
                                            nection can indicate that observing the calcium signal of one cell in a pair provides a lot of
                                            information regarding the signal of the other. FC networks thus are intended to represent



PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                          6/ 23
PLOS COMPUTATIONAL BIOLOGY                                                         Revealing non-trivial information structures in aneural biological tissues




                                            Fig 2. FC inference pipeline as observed in organoid 4. A: Average pixel intensity over time, observed signal peaks
                                            at the time of puncture (t = 0 s) and then remains unstable for a period post puncture. Frames at the time of puncture
                                            are removed, producing two distinct videos: pre- puncture (blue) and post- puncture (red). B: Calcium transience
                                            throughout the observation time frame. Orientation of the organoid changes due to impact from the needle at t =
                                            0 s. C: Cell segmentation as determined by Cellpose pre- puncture. D: Raw calcium signal intensity time series for
                                            a random sample of nine segmented cells (a–k) pre- puncture. E: The same time series after post-processing with
                                            global signal regression and transformation into feature [57] (a–k). F: FC networks are generated by computing
                                            mutual information between all pairs of cells’ processed signal intensity time series. Nodes of the network (blue dots)
                                            represent segmented cells in the organoid. Edges of the network (gray lines) represent non-zero mutual information
                                            between a given pair of nodes. G–J: Same as C–F but for the post- puncture video and displayed in red.
                                            https://doi.org/10.1371/journal.pcbi.1012149.g002


                                            the intrinsic signaling dynamics of a given system over the entire spatial and temporal scale
                                            available for analysis. FC network architecture of the epidermis tissue was examined at both
                                            the basal state and in response to an injury. Nodes represent identified cells in the organoids
                                            and edges represent the magnitude of functional connection (Fig 2F, 2J). Investigating their
                                            properties and organization yields insights into the information structure of this complex,
                                            non-neural tissue, and the differences in structure pre- and post- puncture perturbation.

                                            Functional connectivity networks pre- and post-puncture
                                            FC is a time-averaged, pairwise measure of correlation. Unraveling this measure in the time
                                            dimension produces an edge time series of instantaneous correlations between pairs of cells’



PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149       April 14, 2025                                                                 7/ 23
PLOS COMPUTATIONAL BIOLOGY                                                              Revealing non-trivial information structures in aneural biological tissues



                                                 signals computed using the preprocessed time series data (GSR + feature transformation).
                                                 Edge time series of post- puncture networks were seen to have more highly correlated edges
                                                 at the beginning of the post-puncture observation period (Fig 3, top row of quadruplet plots).
                                                 This is supported by the root sum square (RSS) amplitudes which represent the combined
                                                 magnitudes across all edges for a given network (Fig 3, bottom row of quadruplet plots).
                                                 While there is some increased correlation in the beginning of the pre-puncture period for a
                                                 few organoids (O1, O3, and O5 to a lesser extent), in general pre-puncture RSS amplitudes
                                                 do not display a consistent trend across organoids. On the other hand, post-puncture RSS
                                                 amplitudes (except for organoid 2) display a consistent trend in which the observed ampli-
                                                 tude is high at the beginning of the observation window before rapidly declining towards a
                                                 baseline, somewhat resembling an exponential shape. Taken together, this indicates a poten-
                                                 tially increased integration among cells via highly correlated Ca2+ signals soon after under-
                                                 going puncture damage with quick stabilizing back to a baseline. This increase in integration,
                                                 evident in FC networks, is not due to any sort of global artifact as the analysis is performed
                                                 on the preprocessed time series. Interestingly, some of the edge-time series display bands of
                                                 high-amplitude, global co-fluctuations (Fig 3, O2-post, O4-pre, O6-pre), known as events in
                                                 neuroscience. These intermittent episodes have previously been observed in human brain




 Fig 3. Edge time series, computed as the element-wise product of two z-scored calcium time series, measures instantaneous co-fluctuation between pairs of
 nodes pre- (left) and post- (right) damage for each organoid (top row in quadruplet). Co-fluctuations are plotted by the magnitude away from the mean; where red
 signifies results above the mean, and blue below: these are interpreted as how strongly the cells are connected within the functional connectivity network. Root sum
 squared (RSS) amplitude shows the points in time where many cells collectively co-fluctuate (bottom row in quadruplet). In pre- puncture networks there is no clear
 pattern in co-fluctuations across the organoids, though in post- puncture networks there is a general decrease from strong co-fluctuations and amplitudes to some
 baseline levels.
 https://doi.org/10.1371/journal.pcbi.1012149.g003




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149            April 14, 2025                                                               8/ 23
PLOS COMPUTATIONAL BIOLOGY                                                           Revealing non-trivial information structures in aneural biological tissues



                                                 data [62] and are linked to the presence of a complex underlying generative structure in the
                                                 anatomy [63]. The significance of seeing high amplitude events in organoid tissue is currently
                                                 unclear, and requires more scrutiny, but we propose that it may be a fingerprint of a non-
                                                 trivial interaction structure among the cells as the anatomy of the tissue is nearly uniform and
                                                 organized similar to a checkerboard, with alternating cell types at regular intervals. Further
                                                 research is planned in this area.
                                                     Network analyses were implemented to interrogate and characterize the structure of the FC
                                                 networks, including computing network density and number of edges and nodes (Degree dis-
                                                 tributions give the number of edges connected to a given node providing a good corollary to
                                                 global network structure. Networks both pre- and post- puncture display degree distributions
                                                 with heavier tails and higher maximum degree as compared to our null model (Fig 4). Null
                                                 models were constructed for each network by averaging degree distributions from an ensem-
                                                 ble of 100 Erdős R ̀enyi random graphs, constructed with the same number of nodes and edges
                                                 as the corresponding empirical network.We implement Erdős R ̀enyi graphs as null because
                                                 these are a classic null model in network science; however, while these preserve features of
                                                 the networks (such as average degree), they do not necessarily preserve spatial features of the




 Fig 4. Degree distributions. Empirical networks (black) have heavier tails and higher maximum degrees than expected by random networks (red). The null network
 model used is the average of 100 Erdős R ̀enyi graphs with the same number of nodes and edges as the corresponding empirically derived network.
 https://doi.org/10.1371/journal.pcbi.1012149.g004




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149          April 14, 2025                                                             9/ 23
PLOS COMPUTATIONAL BIOLOGY                                                          Revealing non-trivial information structures in aneural biological tissues




                                            Fig 5. FC is negatively correlated with distance between nodes. A: Spatially closer nodes in organoid 4 tend to
                                            have a higher functional connectivity, represented by higher density on the plot in yellow, pre- (left) and post- (right)
                                            puncture. Organoid 4 has a Spearman correlation coefficient of –0.22 (p = 0.00) before damage and -0.18 (p = 0.00)
                                            after damage. B: Spearman correlation coefficients pre- and post- puncture for all N = 6 organoids.
                                            https://doi.org/10.1371/journal.pcbi.1012149.g005



                                            underlying calcium signaling, such as the wave pattern. The results presented herein there-
                                            fore act as a control for the size of the network only, but all of the physics of how such net-
                                            works are spatially embedded within the tissue, which should be a subject for future work.
                                            Differences between the empirical and the null model suggest that networks both pre- and
                                            post- puncture are not random, but rather contain nodes that are much more connected than
                                            expected by random chance (i.e., the empirical network contains hub nodes). Correspond-
                                            ingly, there are also more nodes with fewer connections than expected by random assignment
                                            of edges. Furthermore, Kolmogorov-Smirnov tests revealed pre- and post- puncture distribu-
                                            tions were significantly different from one another, except for organoid 6, which contained
                                            significantly fewer nodes post- puncture than the other networks (Table 1, S1_Fig).
                                               To illuminate evidence for underpinning characteristics of the non-random structure of
                                            these networks, the correlation between the magnitude of functional connection and spatial
                                            distance between node pairs was investigated via Spearman correlation (Fig 5A). We found
                                            significant negative correlations between the bivariate mutual information between pairs of
                                            cells and the distance separating those two cells across organoids pre- and post- puncture,
                                            except for post- puncture networks for organoids O5 and O6 (negative Spearman correlation
                                            coefficients in Fig 5B, S1_Table). That is, spatially closer cells generally have more coordinated
                                            signaling patterns. Such a finding is in accordance with known signaling in non-excitable tis-
                                            sues, in which adjacent cells are connected structurally via an extracellular matrix and extra-
                                            cellular ligand-receptor interactions, and internally via gap junctions allowing the passage of
                                            small molecules between neighbors [64,65]. Spearman correlation coefficients post- punc-
                                            ture appear less negative than their pre- puncture counterparts suggesting an increase in
                                            higher magnitude long range connections; however, N = 6 is likely too small a sample size to
                                            extrapolate to general trends.


                                           Table 1. Kolmogorov-Smirnov (KS) test statistics and Bonferroni corrected p-values between pre- and post-
                                           puncture distributions.
                                                                               KS                                     p
                                           O1                                  0.095                                  0.001
                                           O2                                  0.367                                  0.000
                                           O3                                  0.534                                  0.000
                                           O4                                  0.243                                  0.000
                                           O5                                  0.270                                  0.000
                                           O6                                  0.188                                  0.928
                                           https://doi.org/10.1371/journal.pcbi.1012149.t001




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149        April 14, 2025                                                                 10/ 23
PLOS COMPUTATIONAL BIOLOGY                                                         Revealing non-trivial information structures in aneural biological tissues




                                            Fig 6. Network modularity. A: FC matrix reordered by modular structure for organoid 4 pre- puncture with the
                                            three largest communities highlighted (blue, green, orange, largest to smallest). B: Physical location of nodes com-
                                            posing the three largest modules painted by color in organoid 4 pre- puncture at t = –1220s. Modular structure can
                                            be clustered locally in space, distributed across the spatial extent of the organoid, or have a combination of the two.
                                            C: FC network visualization with nodes placed by physical location and painted by corresponding module color
                                            (gray represents all other nodes not in the three largest modules). Nodes within a module have more connections to
                                            other nodes within the same module than to nodes outside the module. D: Within- and between- module distance
                                            distributions pre- and post- puncture, normalized by the size of the network for N = 6 organoids. E: Neighbor-
                                            hood modular diversity, measured as the number of distinct modules a given node’s neighbors are members of,
                                            post- puncture networks showed significantly higher diversity then pre- puncture networks (Mann-Whitney U test,
                                            U = 2004296, N = 6, p < 0.001).
                                            https://doi.org/10.1371/journal.pcbi.1012149.g006



                                                Another method we implemented to uncover non-trivial structure is community detec-
                                            tion, which can reveal the modular nature of the networks by identifying potential groups
                                            of cells that are highly functionally connected regardless of physical location. Community
                                            detection was performed using multi-resolution consensus clustering [66] with the Louvain
                                            method [67,68]. Such clustering algorithms work by organizing nodes into groups that max-
                                            imize the number of within-group edges and minimize the number of between-group edges.
                                            FC matrices, square matrices with nodes on both axes (i, j ∈ V) and entries colored by the
                                            magnitude of functional connection between nodes i and j, are sorted by modular structure,
                                            placing nodes within the same community next to one another on the axes. Thus, modules
                                            differentiate as squares along the diagonal with high levels of FC (Fig 6A). Modules can be
                                            interpreted as clusters of cells with large statistical dependencies between cells within the clus-
                                            ter compared to those outside the cluster. The cause of such integrated clusters is not read-
                                            ily obvious; however, as shown in Fig 5, spatially closer cells appear to have more correlated
                                            signaling dynamics and thus modules might appear as groups of cells clustered in space.
                                                Unexpectedly, this is not always the case. Spatial visualization of the three largest commu-
                                            nities both in the organoid (Fig 6B) and the FC network (Fig 6C) reveal by this method show
                                            that while some communities are indeed clustered in space (Fig 6B, 6C, green and orange
                                            modules), others contain nodes that are spread across the entire organoid (Fig 6B, 6C, blue
                                            module). This is further emphasized by observing the distribution of within-module and




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149        April 14, 2025                                                                 11/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            between-module distances, normalized by the maximum distance between two cells in the
                                            organoid, across all samples (Fig 6D). Within-module distributions both pre- and post- punc-
                                            ture have clear peaks at small distances but also extend to larger distances – a noticeably dis-
                                            tinct shape compared to the smooth normal distribution formed by between-module dis-
                                            tances. This unique shape provides evidence for the existence of spatial clustering of commu-
                                            nities across organoids and also indicates a potentially modular structure that is not entirely
                                            spatially dependent, where there may be non-trivial functional correlations present in the
                                            more spread-out modules. To further support the underlying characteristics of this modu-
                                            lar structure, we employed a participation coefficient measure in which each node is scored
                                            based on the number of unique communities its neighbors in the FC network belong to [69].
                                            Nodes in post- puncture networks are connected to a significantly higher fraction of mod-
                                            ules (i.e. have more diverse neighbors) than before puncture, again hinting at an increase in
                                            integration among cells following puncture perturbation (Fig 6E).

                                            Discussion
                                            Here we have demonstrated the use of a general, information-theoretic approach for the large-
                                            scale spatiotemporal analysis of functional connectivity in a non-neural organoid system.
                                            Mutual information was employed as a measure of the correlations between segmented cells’
                                            calcium transience in an organoid as it experiences, and subsequently recovers from, a punc-
                                            ture wound. The approach utilizes information-theoretic and regression preprocessing tech-
                                            niques to control for autocorrelation and global artifacts in the data, ensuring meaningful
                                            correlation is captured in the resulting FC networks. We find evidence for non-trivial, non-
                                            random FC network structure consistent across organoids both pre- and post- puncture.
                                            These constructed FC networks possess characteristics well-known in other biological systems
                                            such as heavy-tail degree distributions and banding behavior, corresponding to events of high
                                            amplitude co-fluctuations.
                                               Consistent with what is known about calcium signaling in epidermal tissue, we find
                                            that the functional connection between cells shows negative correlation with the distance
                                            between them. This, however, does not preclude the presence of long-range, high-magnitude
                                            functional connections. In fact, modular analysis of the networks revealed the existence of
                                            highly correlated, spatially diverse communities of cells. The cause of such modules could
                                            be explained by several features, including the three cell types spaced at regular intervals
                                            across the organoid surface, which may have individual calcium dynamics, or the propa-
                                            gation of non-observable signals below the outer layer of cells. However, discriminating
                                            between these possibilities will require additional analyses that will be the topic of future
                                            work.
                                               In the face of perturbation, the FC networks we constructed retain key characteristics
                                            defining their structure such as heavy tail degree distributions and the presence of hub nodes,
                                            as well as similar spatial embeddings and modular structures pre- and post- puncture. Inter-
                                            estingly, however, our results suggest evidence for an increase in integration among cells
                                            shortly post- puncture as evidenced by the heightened correlation at the beginning of the
                                            post- puncture edge time series. Such a finding suggests that the information structure is
                                            dynamic and able to restructure itself in response to damage. However, we were unable to
                                            discern any reliable signatures of this phenomenon from the data. For example, these might
                                            have included statistically significant results indicating an increase in high-magnitude long-
                                            range connections post- puncture. Or subtle differences in modular structure, which we could
                                            not identify due to limitations in this study, such as the small sample size of N = 6 organoids




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                         12/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            and relatively short time series. Future studies would benefit from increased sample sizes to
                                            increases robustness of statistical inference methods.
                                                An additional limitation in the approach we present is the requirement of the segmen-
                                            tation of individual cells over time from fluorescent microscopy data – a notoriously chal-
                                            lenging task. Image segmentation algorithms are susceptible to poor performance when
                                            cell boundaries are obscured due to blurry or out of focus regions of the image or regions
                                            in which there is widespread high intensity (i.e., a tissue wide calcium flash). The record-
                                            ings used in this study suffer from a combination of these two challenges. Furthermore, the
                                            mechanical puncture event displaced the organoids, preventing image registration software
                                            from being applied to an entire event by recording it continuously. Thus, preprocessing and
                                            analysis of pre- and post- puncture observation periods of the organoid were carried out in
                                            isolation leading to pre- and post- puncture videos having inconsistent segmented cells. Com-
                                            paring networks with different numbers and placements of nodes renders direct comparisons
                                            between pre- and post- puncture networks challenging and thus, we were severely limited in
                                            the analyses we were able to perform. A focus of future work will be on experimental meth-
                                            ods for less disruptive perturbations to enable tracking of the sample throughout the entire
                                            observation period.
                                                Additionally, null model selection is inherently a case-by-case decision: no perfect null
                                            exists, and different models bring their own inherent costs and benefits. Here we aimed to
                                            present a tractable proof-of-principle demonstration and therefore selected a classic null
                                            model in network science, the Erdős R ̀enyi graph, but acknowledge it is, in many respects,
                                            insufficient to capture many physical effects in the tissue. For example, while it preserves fea-
                                            tures of the networks (such as average degree), it does not necessarily preserve spatial features
                                            of the underlying calcium signaling, such as wave patterns. Future researchers applying this
                                            methodology should consider an appropriate null depending on the hypotheses put forward
                                            to account for observed tissue connectivity and informational patterns. For instance, claims
                                            of long-term signaling and/or communication should include a null that specifically focuses
                                            on long-term correlations (such as spreading events). Despite these limitations, we have dis-
                                            played the potential of these tools and believe that with more data at our disposal this could
                                            be a very powerful and comprehensive approach to non-neural tissues.
                                                Aside from increasing the quality and quantity of data, future work should explore the
                                            use of other measures of dependency between cell activity: the FC approach is undirected
                                            and does not account for time-directed effective connections (where the past state of one cell
                                            influences the future state of another). Measures of effective connectivity such as the transfer
                                            entropy may provide a more refined perspective on information “flow” by considering tempo-
                                            ral directionality of signals [30]. Furthermore, there has recently been an explosion of interest
                                            in the phenomena of higher-order/beyond-pairwise interactions in complex systems [70,71],
                                            and many of the tools that have been developed could be easily slotted into the general frame-
                                            work we present here [72–74]. We outline a flexible approach to the problem of inferring
                                            structure from data, and prospective users have considerable freedom to tailor the approach
                                            to different notions of “structure”, including directed or undirected, temporal or atemporal,
                                            pairwise or higher-order, and so-on.
                                                The pipeline presented above is a general framework to be tailored as required, for this
                                            reason it’s worth outlining in greater detail what we mean by that. Network inference and
                                            analysis is a rich field of approaches for which the approach we selected could be tweaked.
                                            For example, our classic approach, based on descriptive statistics, to functional connectivity
                                            is common within the neuroscience literature [26,28,75], could be replaced by a generative
                                            model-based approach [76,77], a Bayesian approach [78], or a higher-order, hyper-graphical
                                            approach [79]. Each approach has pros and cons which may reveal different features within



PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                         13/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            the dataset. Likewise, the problem of community detection is one with many possible avenues
                                            to explore. Here we identified communities based on multi-resolution consensus cluster-
                                            ing [66], but alternative approaches based on block models or generative models may prove
                                            of greater use [80]. We demonstrated merely one of many possible applications of the more
                                            general theory of functional connectivity network analysis to non-neural tissue. While our
                                            results provide preliminary evidence of non-trivial informational structure in a non-neuronal
                                            tissue, future work exploring different methods will be necessary to confirm hypotheses
                                            about informational structure and to reveal new features of self-organization in biological
                                            systems.
                                                Biologically, the use of information theory can enable identifying long-term signaling
                                            dynamics within tissues, and serve as a basis for developing and testing hypotheses about the
                                            nature of information processing and its relation to whole-tissue function. While no mecha-
                                            nistic biological claims are made from the data presented herein, significant changes in net-
                                            work modularity, including neighborhood diversity, can be observed pre- and post- injury.
                                            Are these changes instructive or merely an epiphenomenon of the healing process? Sup-
                                            pression, or enhancement, of these networks via calcium signaling activators and inhibitors
                                            could help shed light on this question [81]. Other related questions include: how do net-
                                            work dynamics change in the face of different types of injury, from mechanical, to thermal, to
                                            chemical? What are the relative contributions of each cell type to the network dynamics and
                                            are correlated longer-range events associated with specific cell types? All of these are impor-
                                            tant questions worth exploring, where each may not require the generation of novel tools and
                                            methods, so much as they require asking questions in new ways, for example, bridging neu-
                                            ronal methods with other tissue-types as we have demonstrated here. The described approach,
                                            along with a growing palette of complementary computational tools, presents new avenues
                                            showing how currently available tools are generalizable to diverse biological systems, with
                                            potential to reveal several hidden signaling modalities across tissues, which are currently
                                            under explored.

                                            Materials and methods
                                            Ethics statement
                                            This study was designed and performed under oversight from the Tufts University Animal
                                            Care and Use Committee (IACUC). All experimental protocols involving amphibians were
                                            reviewed and approved by the IACUC prior to the work beginning, and were certified under
                                            protocol number M2020-35 in compliance with institutional, state, and federal ethical stan-
                                            dards for animal welfare.

                                            Animal husbandry
                                            All experiments were conducted using tissue sourced from the amphibian Xenopus laevis.
                                            Wild type embryos were collected 30 minutes post-fertilization and raised in 0.1x Marc’s
                                            Modified Ringer’s solution (MMR), pH 7.8, until microinjection at the 4-cell stage and animal
                                            cap excision at Nieuwkoop and Faber stage 9 [82].

                                            Microinjection
                                            Microinjection of synthetic mRNA was performed at the 4-cell stage using a pulled glass
                                            capillary, with each of the 4 cells being injected to ensure ubiquitous expression across the
                                            embryo. Synthetic mRNA was synthesized from a linear DNA template using commercially
                                            available kits (Life Technologies), which was stored at –80 ○ C until used. Directly prior to



PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                         14/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            injection, cohorts of healthy wild type embryos were transferred to a laser etched petri dish
                                            containing 3% Ficoll solution. The 4 individual cells of each embryo were then injected with
                                            a pulled glass capillary, delivering approximately 500 ng of mRNA in 50nL of volume to each
                                            cell. After healing for 1 hour, the embryos were washed twice in 0.1x MMR, pH 7.8, to remove
                                            the Ficoll solution, and any damaged embryos were discarded before moving the dish to a
                                            14 ○ C incubator. Two mRNA’s were co-injected in the reported work; GCaMP6s, a reporter
                                            of calcium activity [83,84], and the intracellular domain of Notch (Notch ICD), which is
                                            known to inhibit multiciliated cell induction in developing frog epidermis [53,85,86]. Multi-
                                            ciliated cells were molecularly inhibited in the current study as the presence of these motile
                                            structures causes the mucociliary organoid to move during observation, complicating image
                                            analysis [87–89].

                                            Modified organoid generation
                                            At Nieuwkoop and Faber stage 9, the animal cap of each embryo was removed to generate
                                            epidermal organoids. Cohorts of injected embryos were transferred to a Petri dish contain-
                                            ing 0.75x MMR, lined with 1% agarose to reduce cell/tissue adherence. Using a pair of sharp-
                                            ened microsurgery forceps, the vitelline membrane of each embryo was removed, and the
                                            animal cap (the central portion of the pigmented top of each embryo) was surgically excised
                                            and inverted in the dish. These explants are known to develop into irregular epidermis if
                                            untreated [41–43,88,90]. Following excision, the remainder of the embryos were discarded,
                                            and the tissue was allowed to heal into a spheroid over the course of 3 hours at room temper-
                                            ature. Following healing, the developing tissue moved to new dishes containing 0.75x MMR
                                            and 5 ng/𝜇l gentamicin, lined with 1% agarose, and placed back at 14 ○ C. After an additional
                                            24 hours of development, the animal caps were placed under a glass cover slip for 3 hours at
                                            room temperature, generating continuous compression, which resulted in a permanent flat-
                                            tened tissue which improved optical measurements. Following compression, the explants were
                                            kept at 14 ○ C for 5-6 further days of development until imaging, at which point the tissue had
                                            differentiated into a modified epithelial organoid.

                                            Imaging
                                            All calcium imaging was performed on an Olympus BX-61 microscope equipped with a Pho-
                                            tometrics CoolSNAP DYNO CCD camera and CoolLED pE-300 light source. Individual
                                            organoids were placed in a depression slide containing 0.75x MMR under a 4x objective.
                                            Images were captured using a FITC filter at a rate of 1 frame every 5 seconds, across a total
                                            20 minutes of observation. Capture rate was determined by pilot studies which identified
                                            the minimum time scale to record calcium flashes in individual cells, while also minimiz-
                                            ing exposure to illumination to avoid photobleaching and/or phototoxicity. For the first 20
                                            minutes, basal rates of calcium activity were recorded. After 20 minutes the image capture
                                            was paused, and a pulled glass needle with a tapered tip diameter of 10-15𝜇m was used to
                                            place a puncture near the center of the organoid. Tip diameter was chosen to minimize over-
                                            all damage to the organoid, and the depth of the wound traversed the entire width of the tis-
                                            sue. Immediately following injury, image capture was reinitiated, and proceeded for an addi-
                                            tional 20 minutes of observation. Each organoid was imaged, and injured, individually before
                                            being transferred to a new dish, separate from the samples awaiting processing. Between each
                                            observation period, the glass depression slide was washed with distilled water, cleaned with a
                                            Kimwipe (Kimtech Science), and loaded with fresh 0.75x MMR to avoid sample contamina-
                                            tion across trials. Organoids were imaged across two successive days of development, corre-
                                            sponding to Nieuwkoop and Faber embryonic stages 37-40. All images were captured in tiff



PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                         15/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            format and combined into AVI video files for computational analysis using the FIJI software
                                            package [91].


                                            Video preprocessing
                                            A series of preprocessing steps were performed to transform the videos into time series of cal-
                                            cium intensities for each identified cell in the organoids over time. The puncture event caused
                                            extreme movement of the organoids as well as a high intensity flash of calcium across the
                                            entire organoid obscuring cellular boundaries, making it difficult to track cells throughout
                                            the course of the entire video. Full videos were therefore separated into two distinct videos:
                                            pre- and post- puncture event. The end of the pre- puncture video was aligned with the time
                                            of puncture and the start of the post- puncture video was aligned with the end of immediate
                                            high intensity flash that the puncture caused. Image registration was performed on each pair
                                            of videos to correct for rotational movement of the organoids, improve the quality of video
                                            with a flatfield correction, and do any necessary video cropping. This process was carried out
                                            using Advanced Normalization Tools (ANTs) software [58]. Motion correction aligns cells in
                                            the organoid throughout time such that a segmentation algorithm can be applied to the time-
                                            average of all frames in the video to obtain cell boundaries for the entire series. Cellpose [59],
                                            a generalized deep learning model, was used for cellular segmentation. Hyperparameters of
                                            the Cellpose model were tuned for each video based on visual inspection (cell diameter = 15,
                                            cell threshold = –2.0, flow threshold = 0.8, resample = False). Pixel intensities within each
                                            cell boundary were extracted and averaged at each frame to produce a time series of calcium
                                            intensities. These steps result in two time series arrays (pre- and post- puncture) of size # cells
                                            × # frames for each organoid (S1_Fig, S2_Table).


                                            Signal preprocessing
                                            Utilized here was an information-theoretic pipeline to infer pairwise statistical dependen-
                                            cies between individual cells. Information theory has been previously discussed as a gen-
                                            eral framework for inferring systems-level structures in complex, biological systems [33,92].
                                            Two signal preprocessing steps were applied to emphasize underlying structures in the data
                                            and allow for more meaningful inferences: global signal regression and transformation into a
                                            conditional entropy rate.
                                                Global signal regression attempts to remove global artifacts by regressing out the mean sig-
                                            nal across all cells. The transformation into a conditional entropy rate is a little more involved;
                                            inspired by Daube et al., [60], the calcium data for every cell was transformed into time series
                                            of the instantaneous local entropy rates. This transforms the raw calcium series into a feature-
                                            series that highlights those parts of the signal that we think are relevant to cell-cell interac-
                                            tions, in the style of [57]. Intuitively, this transformation highlights those moments where the
                                            cell’s behavior is deviating highly from the trend defined by its own historical dynamics. These
                                            deviations could come from two places: intrinsic randomness in X’s own dynamics, or from
                                            perturbation by another cell Y, whose activity informs on X’s own activity.
                                                Formally, for a given cell, X, at every time t, the information content of the observation xt
                                            is given by the local entropy:

                                                                                      h(xt ) = – log P(xt )                                         (1)

                                              Where P(xt ) is the probability of observing X = x. The local entropy (also called the Shan-
                                            non information content, or surprisal) quantifies how much information about the state of X




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                         16/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            is disclosed by the observation of xt . This information can be decomposed into two compo-
                                            nents:
                                                                           h(xt ) = h(xt ) = h(xt |xt–1 ) + i(xt–1 ; xt )                           (2)
                                            where i(xt–1 ; xt ) is the information about xt that could be learned by observing the immedi-
                                            ate past xt–1 (sometimes called the local active information storage [93,94]), while h(xt |xt–1 ) is
                                            the remaining information that could not be learned by observing the past (sometimes called
                                            the local conditional entropy rate [93]). All local entropies were estimated using Gaussian
                                            estimators and computed using the JIDT [95] and IDTxl [96] packages.
                                               It is important to stress, that, in contrast to Daube et al., [60], we do not interpret this
                                            transformation into local entropy rates as “whitening” the data, in the sense of removing auto-
                                            correlation while preserving the same information. While the local entropy rate signal is less
                                            autocorrelated than the raw signal, this is not necessarily guaranteed to be the case for all data.
                                            Instead, we interpret it as a feature, highlighting those moments when the signal is deviating
                                            from the expected trend.
                                               Finally, after transformation, excessively noisy frames associated with recording artifacts
                                            were deleted. Frames where the absolute value of the change in local entropy rate were greater
                                            than two times that standard deviation were classified as outliers and removed. The classifica-
                                            tions were manually checked by visual inspection as well, to ensure only artifact frames were
                                            removed.

                                            Functional connectivity network inference
                                            Undirected networks for each time series were generated based on instantaneous correlation
                                            (functional connectivity) [26–28,75]. Nodes of these networks are identified cells and edges
                                            are functional connections between each pair of cells in the network computed as the Gaus-
                                            sian mutual information between the pair’s signal time series. Gaussian mutual information
                                            was computed based on the identity:

                                                                                                   – ln(1 – r2 )
                                                                                   I(X1 , X2 ) =                                                    (3)
                                                                                                        2

                                            where r is the Pearson correlation coefficient between X1 and X2 [97]. Mutual information
                                            was chosen as the transformation because unlike the Pearson correlation coefficient, is strictly
                                            non-negative, a key desiderata when analyzing networks. Edges were retained only if the p-
                                            value associated with the mutual information computation was greater than or equal to 𝛼 ≤
                                            10–3 (Bonferroni-corrected against the number of possible edges in the network). Each net-
                                            work was Bonferroni-corrected independently, making the corrected significance thresh-
                                            old 10–3 /((N2 – N)/2), where N is the number of nodes in a given network. Thresholding
                                            a functional connectivity network of this type remains controversial due to trade-offs for it
                                            or lack thereof. Thresholding unstructured networks can bias the resulting network towards
                                            a more complex topology [98], however, unthresholded statistical networks can include
                                            false-positive edges, creating an illusion of greater integration. Similarly, how to best infer
                                            the structure of the network is an open debate. Here we opted for a classic approach based
                                            on descriptive statistics, other options are available. In particular, approaches utilizing gen-
                                            erative models have recently become a topic of intense research [76,77,80]. Ultimately, the
                                            decision here was thresholding on the functional connectivity networks and classic statistics
                                            on the networks. Interested researchers should defer to the particular demands of the study
                                            under question to determine what approach is suitable to the required network inference and
                                            analysis.



PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                         17/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            Co-fluctuation & edge time series
                                            The co-fluctuation analysis was done following the method described in Zamani Esfahlani et
                                            al., 2020 [62]. Briefly, each pair of nodal time series was z-scored and multiplied together ele-
                                            mentwise to construct an edge time series, where the value of the series at a given time reflects
                                            the degree to which those two edges were co-fluctuating together or in opposite directions.
                                            Then, the root sum squared deviation from the mean was computed framewise to identify
                                            how global co-fluctuations are distributed throughout the duration of the recording (see [63],
                                            for more details on high-amplitude co-fluctuations). The instantaneous co-fluctuation bears a
                                            strong resemblance to the pointwise mutual information [93,99], another time-resolved mea-
                                            sure of dependency between dynamic variables, although the interpretations and meaning of
                                            the signs differ. Continuing with the theme of analytic flexibility, future researchers should
                                            consider whether the instantaneous co-fluctuation/edge time series or the instantaneous,
                                            pointwise mutual information makes the most sense for their particular analysis.

                                            Supporting information
                                            S1 Fig. General network characteristic. Number of Nodes, Edges, and Network Density for
                                            each video.
                                            (TIFF)
                                            S1 Table. Spearman’s rank correlation between FC and distance between nodes.
                                            (TEX)
                                            S2 Table. Number of frames per video. Corresponds to number of time steps in time series.
                                            (TEX)


                                            Author contributions
                                            Conceptualization: Douglas Blackiston, Joshua Bongard, Michael Levin, Sara I. Walker.
                                            Data curation: Hannah Dromiack, Caitlin Grasso.
                                            Formal analysis: Caitlin Grasso, Thomas F. Varley.
                                            Funding acquisition: Joshua Bongard, Michael Levin, Sara I. Walker.
                                            Investigation: Douglas Blackiston.
                                            Methodology: Thomas F. Varley.
                                            Project administration: Hannah Dromiack, Sara I. Walker.
                                            Resources: Douglas Blackiston.
                                            Software: Douglas G. Moore, Krishna Kannan Srinivasan.
                                            Supervision: Olaf Sporns, Joshua Bongard, Michael Levin, Sara I. Walker.
                                            Visualization: Douglas Blackiston, Caitlin Grasso.
                                            Writing – original draft: Douglas Blackiston, Hannah Dromiack, Caitlin Grasso, Thomas F.
                                             Varley.
                                            Writing – review & editing: Hannah Dromiack, Olaf Sporns, Joshua Bongard, Michael Levin,
                                             Sara I. Walker.




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                         18/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            References
                                             1.   Davies PCW, Walker SI. The hidden simplicity of biology. Rep Prog Phys. 2016;79(10):102601.
                                                  https://doi.org/10.1088/0034-4885/79/10/102601 PMID: 27608530
                                             2.   Larsen AZ, Kummer U. In: Information processing in calcium signal transduction. Berlin,
                                                  Heidelberg: Springer; 2003. p. 153–78.
                                             3.   Kudla J, Batistic O, Hashimoto K. Calcium signals: the lead currency of plant information
                                                  processing. Plant Cell. 2010;22(3):541–63. https://doi.org/10.1105/tpc.109.072686 PMID:
                                                  20354197
                                             4.   Ingber DE. Tensegrity II. How structural networks influence cellular information processing
                                                  networks. J Cell Sci. 2003;116(Pt 8):1397–408. https://doi.org/10.1242/jcs.00360 PMID: 12640025
                                             5.   Balázsi G, van Oudenaarden A, Collins JJ. Cellular decision making and biological noise: from
                                                  microbes to mammals. Cell. 2011;144(6):910–25. https://doi.org/10.1016/j.cell.2011.01.030 PMID:
                                                  21414483
                                             6.   Timme NM, Lapish C. A tutorial for information theory in neuroscience. eNeuro.
                                                  2018;5(3):ENEURO.0052-18.2018. https://doi.org/10.1523/ENEURO.0052-18.2018 PMID:
                                                  30211307
                                             7.   Daniels BC, Flack JC, Krakauer DC. Dual coding theory explains biphasic collective computation in
                                                  neural decision-making. Front Neurosci. 2017;11:313. https://doi.org/10.3389/fnins.2017.00313
                                                  PMID: 28634436
                                             8.   Schneidman E, Bialek W, Berry M. An information theoretic approach to the functional classification
                                                  of neurons. arXiv preprint 2002. https://doi.org/10.48550/ARXIV.PHYSICS/0212114
                                             9.   Palmer SE, Marre O, Berry MJ 2nd, Bialek W. Predictive information in a sensory population. Proc
                                                  Natl Acad Sci U S A. 2015;112(22):6908–13. https://doi.org/10.1073/pnas.1506855112 PMID:
                                                  26038544
                                            10.   Li M, Han Y, Aburn MJ, Breakspear M, Poldrack RA, Shine JM, et al. Transitions in information
                                                  processing dynamics at the whole-brain network level are driven by alterations in neural gain. PLoS
                                                  Comput Biol. 2019;15(10):e1006957. https://doi.org/10.1371/journal.pcbi.1006957 PMID: 31613882
                                            11.   Lyon P, Keijzer F, Arendt D, Levin M. Reframing cognition: getting down to biological basics. Philos
                                                  Trans R Soc Lond B Biol Sci. 2021;376(1820):20190750. https://doi.org/10.1098/rstb.2019.0750
                                                  PMID: 33487107
                                            12.   Baluška F, Levin M. On having no head: cognition throughout biological systems. Front Psychol.
                                                  2016;7:902. https://doi.org/10.3389/fpsyg.2016.00902 PMID: 27445884
                                            13.   Moore D, Walker SI, Levin M. Cancer as a disorder of patterning information: computational and
                                                  biophysical perspectives on the cancer problem. Converg Sci Phys Oncol. 2017;3(4):043001.
                                                  https://doi.org/10.1088/2057-1739/aa8548
                                            14.   Hoel E, Levin M. Emergence of informative higher scales in biological systems: a computational
                                                  toolkit for optimal prediction and control. Commun Integr Biol. 2020;13(1):108–18.
                                                  https://doi.org/10.1080/19420889.2020.1802914 PMID: 33014263
                                            15.   Kudithipudi D, Aguilar-Simon M, Babb J, Bazhenov M, Blackiston D, Bongard J, et al. Biological
                                                  underpinnings for lifelong learning machines. Nat Mach Intell. 2022;4(3):196–210.
                                                  https://doi.org/10.1038/s42256-022-00452-0
                                            16.   Walker SI, Kim H, Davies PCW. The informational architecture of the cell. Philos Trans A Math
                                                  Phys Eng Sci. 2016;374(2063):20150057. https://doi.org/10.1098/rsta.2015.0057 PMID: 26857675
                                            17.   Ghosheh M, Ehrlich A, Ioannidis K, Ayyash M, Goldfracht I, Cohen M, et al. Electro-metabolic
                                                  coupling in multi-chambered vascularized human cardiac organoids. Nat Biomed Eng.
                                                  2023;7(11):1493–513. https://doi.org/10.1038/s41551-023-01071-9 PMID: 37550423
                                            18.   Spira ME, Hai A. Multi-electrode array technologies for neuroscience and cardiology. Nat
                                                  Nanotechnol. 2013;8(2):83–94. https://doi.org/10.1038/nnano.2012.265 PMID: 23380931
                                            19.   Simons M, Mlodzik M. Planar cell polarity signaling: from fly development to human disease. Annu
                                                  Rev Genet. 2008;42:517–40. https://doi.org/10.1146/annurev.genet.42.110807.091432 PMID:
                                                  18710302
                                            20.   Butler MT, Wallingford JB. Planar cell polarity in development and disease. Nat Rev Mol Cell Biol.
                                                  2017;18(6):375–88. https://doi.org/10.1038/nrm.2017.11 PMID: 28293032
                                            21.   Rong G, Corrie SR, Clark HA. In vivo biosensing: progress and perspectives. ACS Sens.
                                                  2017;2(3):327–38. https://doi.org/10.1021/acssensors.6b00834 PMID: 28723197
                                            22.   Jones C, Roper VC, Foucher I, Qian D, Banizs B, Petit C, et al. Ciliary proteins link basal body
                                                  polarization to planar cell polarity regulation. Nat Genet. 2008;40(1):69–77.
                                                  https://doi.org/10.1038/ng.2007.54 PMID: 18066062




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                         19/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            23.   Dos Santos M, Backer S, Saintpierre B, Izac B, Andrieu M, Letourneur F, et al. Single-nucleus
                                                  RNA-seq and FISH identify coordinated transcriptional activity in mammalian myofibers. Nat
                                                  Commun. 2020;11(1):5102. https://doi.org/10.1038/s41467-020-18789-8 PMID: 33037211
                                            24.   Petrany MJ, Swoboda CO, Sun C, Chetal K, Chen X, Weirauch MT, et al. Single-nucleus RNA-seq
                                                  identifies transcriptional heterogeneity in multinucleated skeletal myofibers. Nat Commun.
                                                  2020;11(1):6374. https://doi.org/10.1038/s41467-020-20063-w PMID: 33311464
                                            25.   Jin S, Guerrero-Juarez CF, Zhang L, Chang I, Ramos R, Kuan C-H, et al. Inference and analysis of
                                                  cell-cell communication using CellChat. Nat Commun. 2021;12(1):1088.
                                                  https://doi.org/10.1038/s41467-021-21246-9 PMID: 33597522
                                            26.   Rubinov M, Sporns O. Complex network measures of brain connectivity: uses and interpretations.
                                                  Neuroimage. 2010;52(3):1059–69. https://doi.org/10.1016/j.neuroimage.2009.10.003 PMID:
                                                  19819337
                                            27.   Friston KJ. Functional and effective connectivity: a review. Brain Connect. 2011;1(1):13–36.
                                                  https://doi.org/10.1089/brain.2011.0008 PMID: 22432952
                                            28.   Sporns O. Networks of the brain. Cambridge, Mass: MIT Press; 2011.
                                            29.   Shannon CE. A mathematical theory of communication. Bell Syst Tech J. 1948;27(3):379–423.
                                            30.   Schreiber T. Measuring information transfer. Phys Rev Lett. 2000;85(2):461–4.
                                                  https://doi.org/10.1103/PhysRevLett.85.461 PMID: 10991308
                                            31.   Brodskiy PA, Zartman JJ. Calcium as a signal integrator in developing epithelial tissues. Phys Biol.
                                                  2018;15(5):051001. https://doi.org/10.1088/1478-3975/aabb18 PMID: 29611534
                                            32.   Dodd AN, Kudla J, Sanders D. The language of calcium signaling. Annu Rev Plant Biol.
                                                  2010;61:593–620. https://doi.org/10.1146/annurev-arplant-070109-104628 PMID: 20192754
                                            33.   McMillen P, Walker SI, Levin M. Information theory as an experimental tool for integrating disparate
                                                  biophysical signaling modules. Int J Mol Sci. 2022;23(17):9580.
                                                  https://doi.org/10.3390/ijms23179580 PMID: 36076979
                                            34.   Lansdown ABG. Calcium: a potential central regulator in wound healing in the skin. Wound Repair
                                                  Regen. 2002;10(5):271–85. https://doi.org/10.1046/j.1524-475x.2002.10502.x PMID: 12406163
                                            35.   Knot HJ, Laher I, Sobie EA, Guatimosim S, Gomez-Viquez L, Hartmann H, et al. Twenty years of
                                                  calcium imaging: cell physiology to dye for. Mol Interv. 2005;5(2):112–27.
                                                  https://doi.org/10.1124/mi.5.2.8 PMID: 15821159
                                            36.   Li S, Liu Y, Zhang N, Li W, Xu W-J, Xu Y-Q, et al. Perspective of calcium imaging technology
                                                  applied to acupuncture research. Chin J Integr Med. 2024;30(1):3–9.
                                                  https://doi.org/10.1007/s11655-023-3692-2 PMID: 36795265
                                            37.   Subramaniam T, Fauzi MB, Lokanathan Y, Law JX. The role of calcium in wound healing. Int J Mol
                                                  Sci. 2021;22(12):6486. https://doi.org/10.3390/ijms22126486 PMID: 34204292
                                            38.   Aihara E, Hentz CL, Korman AM, Perry NPJ, Prasad V, Shull GE, et al. In vivo epithelial wound
                                                  repair requires mobilization of endogenous intracellular and extracellular calcium. J Biol Chem.
                                                  2013;288(47):33585–97. https://doi.org/10.1074/jbc.M113.488098 PMID: 24121509
                                            39.   Zulueta-Coarasa T, Fernandez-Gonzalez R. Tension (re)builds: biophysical mechanisms of
                                                  embryonic wound repair. Mech Dev. 2017;144(Pt A):43–52.
                                                  https://doi.org/10.1016/j.mod.2016.11.004 PMID: 27989746
                                            40.   Yoo SK, Freisinger CM, LeBert DC, Huttenlocher A. Early redox, Src family kinase, and calcium
                                                  signaling integrate wound responses and tissue regeneration in zebrafish. J Cell Biol.
                                                  2012;199(2):225–34. https://doi.org/10.1083/jcb.201203154 PMID: 23045550
                                            41.   Jones EA, Woodland HR. Development of the ectoderm in Xenopus: tissue specification and the
                                                  role of cell association and division. Cell. 1986;44(2):345–55.
                                                  https://doi.org/10.1016/0092-8674(86)90769-5 PMID: 3943127
                                            42.   Green J. In: The animal cap assay. Humana Press;. p. 1–14.
                                            43.   Lee J, Møller AF, Chae S, Bussek A, Park TJ, Kim Y, et al. A single-cell, time-resolved profiling of
                                                  Xenopus mucociliary epithelium reveals nonhierarchical model of development. Sci Adv.
                                                  2023;9(14):eadd5745. https://doi.org/10.1126/sciadv.add5745 PMID: 37027470
                                            44.   Walentek P, Bogusch S, Thumberger T, Vick P, Dubaissi E, Beyer T, et al. A novel
                                                  serotonin-secreting cell type regulates ciliary motility in the mucociliary epidermis of Xenopus
                                                  tadpoles. Development. 2014;141(7):1526–33. https://doi.org/10.1242/dev.102343 PMID:
                                                  24598162
                                            45.   Walentek P, Quigley IK. What we can learn from a tadpole about ciliopathies and airway diseases:
                                                  using systems biology in Xenopus to study cilia and mucociliary epithelia. Genesis. 2017;55(1–2).
                                                  https://doi.org/10.1002/dvg.23001




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                         20/ 23
PLOS COMPUTATIONAL BIOLOGY                                                     Revealing non-trivial information structures in aneural biological tissues



                                            46.   Walentek P. Xenopus epidermal and endodermal epithelia as models for mucociliary epithelial
                                                  evolution, disease, and metaplasia. Genesis. 2021;59(1–2):e23406.
                                                  https://doi.org/10.1002/dvg.23406 PMID: 33400364
                                            47.   Dubaissi E, Papalopulu N. Embryonic frog epidermis: a model for the study of cell-cell interactions
                                                  in the development of mucociliary disease. Dis Model Mech. 2011;4(2):179–92.
                                                  https://doi.org/10.1242/dmm.006494 PMID: 21183475
                                            48.   Davidson LA, Ezin AM, Keller R. Embryonic wound healing by apical contraction and ingression in
                                                  Xenopus laevis. Cell Motil Cytoskeleton. 2002;53(3):163–76. https://doi.org/10.1002/cm.10070
                                                  PMID: 12211099
                                            49.   Kriegman S, Blackiston D, Levin M, Bongard J. A scalable pipeline for designing reconfigurable
                                                  organisms. Proc Natl Acad Sci U S A. 2020;117(4):1853–9.
                                                  https://doi.org/10.1073/pnas.1910837117 PMID: 31932426
                                            50.   Blackiston D, Kriegman S, Bongard J, Levin M. Biological robots: perspectives on an emerging
                                                  interdisciplinary field. Soft Robot. 2023;10(4):674–86. https://doi.org/10.1089/soro.2022.0142
                                                  PMID: 37083430
                                            51.   Werner ME, Mitchell BJ. In: Using xenopus skin to study cilia development and function. Elsevier;
                                                  2013. p. 191–217.
                                            52.   Mitchell B, Stubbs JL, Huisman F, Taborek P, Yu C, Kintner C. The PCP pathway instructs the
                                                  planar orientation of ciliated cells in the Xenopus larval skin. Curr Biol. 2009;19(11):924–9.
                                                  https://doi.org/10.1016/j.cub.2009.04.018 PMID: 19427216
                                            53.   Deblandre GA, Wettstein DA, Koyano-Nakagawa N, Kintner C. A two-step mechanism generates
                                                  the spacing pattern of the ciliated cells in the skin of Xenopus embryos. Development.
                                                  1999;126(21):4715–28. https://doi.org/10.1242/dev.126.21.4715 PMID: 10518489
                                            54.   Collins C, Ventrella R, Mitchell BJ. In: Building a ciliated epithelium: Transcriptional regulation and
                                                  radial intercalation of multiciliated cells. Elsevier; 2021. p. 3–39.
                                            55.   Walentek P. In: Manipulating and analyzing cell type composition of the xenopus mucociliary
                                                  epidermis. New York: Springer; 2018. p. 251–63.
                                            56.   Blackiston D, Lederer E, Kriegman S, Garnier S, Bongard J, Levin M. A cellular platform for the
                                                  development of synthetic living machines. Sci Robot. 2021;6(52):eabf1571.
                                                  https://doi.org/10.1126/scirobotics.abf1571 PMID: 34043553
                                            57.   Nguyen A, McMullin O, Lizier JT, Fulcher BD. A feature-based information-theoretic approach for
                                                  detecting interpretable, long-timescale pairwise interactions from time series; 2024. Available from:
                                                  https://arxiv.org/abs/2404.05929v1
                                            58.   Avants B, Tustison NJ, Song G. Advanced normalization tools: V1.0. The Insight J. 2009.
                                                  https://doi.org/10.54294/uvnhin
                                            59.   Stringer C, Wang T, Michaelos M, Pachitariu M. Cellpose: a generalist algorithm for cellular
                                                  segmentation. Nat Methods. 2021;18(1):100–6. https://doi.org/10.1038/s41592-020-01018-x PMID:
                                                  33318659
                                            60.   Daube C, Gross J, Ince R. A whitening approach for Transfer Entropy permits the application to
                                                  narrow-band signals. arXiv prepint 2022. arXiv:2201.02461
                                            61.   Liu TT, Nalci A, Falahpour M. The global signal in fMRI: nuisance or information?. Neuroimage.
                                                  2017;150:213–29. https://doi.org/10.1016/j.neuroimage.2017.02.036 PMID: 28213118
                                            62.   Zamani Esfahlani F, Jo Y, Faskowitz J, Byrge L, Kennedy DP, Sporns O, et al. High-amplitude
                                                  cofluctuations in cortical activity drive functional connectivity. Proc Natl Acad Sci U S A.
                                                  2020;117(45):28393–401. https://doi.org/10.1073/pnas.2005531117 PMID: 33093200
                                            63.   Pope M, Fukushima M, Betzel RF, Sporns O. Modular origins of high-amplitude cofluctuations in
                                                  fine-scale functional connectivity dynamics. Proc Natl Acad Sci U S A. 2021;118(46):e2109380118.
                                                  https://doi.org/10.1073/pnas.2109380118 PMID: 34750261
                                            64.   Sapir L, Tzlil S. Talking over the extracellular matrix: How do cells communicate mechanically?.
                                                  Semin Cell Dev Biol. 2017;71:99–105. https://doi.org/10.1016/j.semcdb.2017.06.010 PMID:
                                                  28630027
                                            65.   Hervé J-C, Derangeon M. Gap-junction-mediated cell-to-cell communication. Cell Tissue Res.
                                                  2013;352(1):21–31. https://doi.org/10.1007/s00441-012-1485-6 PMID: 22940728
                                            66.   Jeub LGS, Sporns O, Fortunato S. Multiresolution Consensus Clustering in Networks. Sci Rep.
                                                  2018;8(1):3259. https://doi.org/10.1038/s41598-018-21352-7 PMID: 29459635
                                            67.   Blondel VD, Guillaume J-L, Lambiotte R, Lefebvre E. Fast unfolding of communities in large
                                                  networks. J Stat Mech. 2008;2008(10):P10008. https://doi.org/10.1088/1742-5468/2008/10/p10008
                                            68.   Rubinov M. Circular and unified analysis in network neuroscience. Elife. 2023;12:e79559.
                                                  https://doi.org/10.7554/eLife.79559 PMID: 38014843




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                          21/ 23
PLOS COMPUTATIONAL BIOLOGY                                                    Revealing non-trivial information structures in aneural biological tissues



                                            69.   Power JD, Schlaggar BL, Lessov-Schlaggar CN, Petersen SE. Evidence for hubs in human
                                                  functional brain networks. Neuron. 2013;79(4):798–813.
                                                  https://doi.org/10.1016/j.neuron.2013.07.035 PMID: 23972601
                                            70.   Rosas FE, Mediano PAM, Luppi AI, Varley TF, Lizier JT, Stramaglia S, et al. Disentangling
                                                  high-order mechanisms and high-order behaviours in complex systems. Nat Phys.
                                                  2022;18(5):476–7. https://doi.org/10.1038/s41567-022-01548-5
                                            71.   Battiston F, Cencetti G, Iacopini I, Latora V, Lucas M, Patania A, et al. Networks beyond pairwise
                                                  interactions: structure and dynamics. Physics Reports. 2020;874:1–92.
                                                  https://doi.org/10.1016/j.physrep.2020.05.004.
                                            72.   Newman EL, Varley TF, Parakkattu VK, Sherrill SP, Beggs JM. Revealing the dynamics of neural
                                                  information processing with multivariate information decomposition. Entropy (Basel).
                                                  2022;24(7):930. https://doi.org/10.3390/e24070930 PMID: 35885153
                                            73.   Varley TF, Pope M, Puxeddu MG, Faskowitz J, Sporns O. Partial entropy decomposition reveals
                                                  higher-order information structures in human brain activity. Proc Natl Acad Sci U S A.
                                                  2023;120(30):e2300888120. https://doi.org/10.1073/pnas.2300888120 PMID: 37467265
                                            74.   Varley TF, Pope M, Faskowitz J, Sporns O. Multivariate information theory uncovers synergistic
                                                  subsystems of the human cerebral cortex. Commun Biol. 2023;6(1):451.
                                                  https://doi.org/10.1038/s42003-023-04843-w PMID: 37095282
                                            75.   Menczer F, Fortunato S, Davis CA. A first course in network science. Cambridge University Press;
                                                  2020.
                                            76.   Peixoto TP. Network reconstruction and community detection from dynamics. Phys Rev Lett.
                                                  2019;123(12):128301. https://doi.org/10.1103/PhysRevLett.123.128301 PMID: 31633974
                                            77.   Peixoto T. Network reconstruction via the minimum description length principle. arXiv preprint 2024.
                                            78.   Young J-G, Cantwell GT, Newman MEJ. Bayesian inference of network structure from unreliable
                                                  data. J Complex Netw. 2020;8(6): cnaa046. https://doi.org/10.1093/comnet/cnaa046
                                            79.   Contisciani M, Battiston F, De Bacco C. Inference of hyperedges and overlapping communities in
                                                  hypergraphs. Nat Commun. 2022;13(1):7229. https://doi.org/10.1038/s41467-022-34714-7 PMID:
                                                  36433942
                                            80.   Peixoto T. Descriptive vs. inferential community detection: pitfalls, myths and half-truths. arXiv
                                                  prerpint 2021;arXIv:2112.00183.
                                            81.   Brugués A, Anon E, Conte V, Veldhuis JH, Gupta M, Colombelli J, et al. Forces driving epithelial
                                                  wound healing. Nat Phys. 2014;10(9):683–90. https://doi.org/10.1038/nphys3040 PMID: 27340423
                                            82.   Faber J. Normal table of xenopus laevis (Daudin). Nieuwkoop PD, editor. Milton: CRC Press LLC;
                                                  1994.
                                            83.   Chen J, Xia L, Bruchas MR, Solnica-Krezel L. Imaging early embryonic calcium activity with
                                                  GCaMP6s transgenic zebrafish. Dev Biol. 2017;430(2):385–96.
                                                  https://doi.org/10.1016/j.ydbio.2017.03.010 PMID: 28322738
                                            84.   Offner T, Daume D, Weiss L, Hassenklöver T, Manzini I. Whole-brain calcium imaging in larval
                                                  xenopus. Cold Spring Harb Protoc. 2020;2020(12):10.1101/pdb.prot106815.
                                                  https://doi.org/10.1101/pdb.prot106815 PMID: 33037078
                                            85.   Werner ME, Mitchell BJ. Understanding ciliated epithelia: the power of Xenopus. Genesis.
                                                  2012;50(3):176–85. https://doi.org/10.1002/dvg.20824 PMID: 22083727
                                            86.   Spassky N, Meunier A. The development and functions of multiciliated epithelia. Nat Rev Mol Cell
                                                  Biol. 2017;18(7):423–36. https://doi.org/10.1038/nrm.2017.21 PMID: 28400610
                                            87.   Huynh MH, Hong H, Delovitch S, Desser S, Ringuette M. Association of SPARC (osteonectin,
                                                  BM-40) with extracellular and intracellular components of the ciliated surface ectoderm of Xenopus
                                                  embryos. Cell Motil Cytoskeleton. 2000;47(2):154–62.
                                                  https://doi.org/10.1002/1097-0169(200010)47:2<154::AID-CM6>3.0.CO;2-L PMID: 11013395
                                            88.   Angerilli A, Smialowski P, Rupp RA. The Xenopus animal cap transcriptome: building a mucociliary
                                                  epithelium. Nucleic Acids Res. 2018;46(17):8772–87. https://doi.org/10.1093/nar/gky771 PMID:
                                                  30165493
                                            89.   Kang HJ, Kim HY. Mucociliary epithelial organoids from xenopus embryonic cells: generation,
                                                  culture and high-resolution live imaging. J Vis Exp. 2020;(161):10.3791/61604.
                                                  https://doi.org/10.3791/61604 PMID: 32804169
                                            90.   Sive HL, Grainger RM, Harland RM. Animal cap isolation from Xenopus laevis. CSH Protoc.
                                                  2007;2007:pdb.prot4744. https://doi.org/10.1101/pdb.prot4744 PMID: 21357092
                                            91.   Schindelin J, Arganda-Carreras I, Frise E, Kaynig V, Longair M, Pietzsch T, et al. Fiji: an
                                                  open-source platform for biological-image analysis. Nat Methods. 2012;9(7):676–82.
                                                  https://doi.org/10.1038/nmeth.2019 PMID: 22743772




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                         22/ 23
PLOS COMPUTATIONAL BIOLOGY                                                     Revealing non-trivial information structures in aneural biological tissues



                                            92.   Bossomaier T, Barnett L, Harr´e M, Lizier JT. An Introduction to Transfer Entropy: Information Flow
                                                  in Complex Systems. Springer; 2016.
                                            93.   Lizier JT. The local information dynamics of distributed computation in complex systems. Springer
                                                  Theses. Berlin, Heidelberg: Springer Berlin Heidelberg; 2013. Available from:
                                                  http://link.springer.com/10.1007/978-3-642-32952-4
                                            94.   Wibral M, Lizier JT, Vögler S, Priesemann V, Galuske R. Local active information storage as a tool
                                                  to understand distributed neural information processing. Front Neuroinform. 2014;8:1.
                                                  https://doi.org/10.3389/fninf.2014.00001 PMID: 24501593
                                            95.   Lizier JT. JIDT: an information-theoretic toolkit for studying the dynamics of complex systems. Front
                                                  Robot AI. 2014;1. https://doi.org/10.3389/frobt.2014.00011
                                            96.   Wollstadt P, Lizier J, Vicente R, Finn C, Martinez-Zarzuela M, Mediano P, et al. IDTxl: the
                                                  information dynamics toolkit xl: a Python package for the efficient analysis of multivariate
                                                  information dynamics in networks. JOSS. 2019;4(34):1081. https://doi.org/10.21105/joss.01081
                                            97.   Cover TM, Thomas JA. Elements of information theory. John Wiley & Sons; 2012.
                                            98.   Cantwell GT, Liu Y, Maier BF, Schwarze AC, Serván CA, Snyder J, et al. Thresholding normally
                                                  distributed data creates complex networks. Phys Rev E. 2020;101(6–1):062302.
                                                  https://doi.org/10.1103/PhysRevE.101.062302 PMID: 32688475
                                            99.   Pope M, Varley TF, Sporns O. Time-varying synergy/redundancy dominance in the human cerebral
                                                  cortex. 2024. https://doi.org/10.1101/2024.06.14.599102




PLOS Computational Biology https://doi.org/10.1371/journal.pcbi.1012149   April 14, 2025                                                          23/ 23
