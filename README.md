# HCC Post-Hepatectomy Overall Survival Calculator

Web-based calculator for the simplified point-based scoring model derived from the manuscript:

**A Multicenter Fusion Model Integrating CT Body Composition and Clinical Biomarkers for Survival Prediction in Hepatocellular Carcinoma**

## Overview

This tool is intended for use in patients with **pathologically confirmed hepatocellular carcinoma (HCC)** who undergo **hepatic resection**.

- Disease focus: hepatocellular carcinoma
- Clinical scenario: postoperative prognostic assessment after hepatectomy
- Primary endpoint: overall survival (OS)
- Tool type: simplified web-based scoring calculator
- Score range: **0-11**
- Risk groups: **Low risk (0-5)** and **High risk (6-11)**

## Variables Required

The simplified score requires the following 7 inputs:

1. Age (years)
2. Intraoperative transfusion (Yes/No)
3. AFP (ng/mL)
4. CA 19-9 (U/mL)
5. Skeletal Muscle Area, SMA (cm2)
6. Skeletal Muscle Density, SMD (HU)
7. Liver-to-Spleen Ratio, LSR

## Scoring Rule Implemented

Points are assigned according to the manuscript-derived dichotomized thresholds:

- Age >= 67: +2
- Intraoperative transfusion = Yes: +1
- AFP >= 14.62: +1
- CA 19-9 >= 20.75: +2
- SMA < 164.7: +3
- SMD < 34.93: +1
- LSR >= 1.1956: +1

Total score: **0-11**

Risk classification:

- **Low risk:** 0-5
- **High risk:** 6-11

## How to Use the Calculator

1. Open the web interface.
2. Enter all seven predictors.
3. Click **Calculate Risk Score**.
4. Review the generated output:
   total score, risk group, and point contribution for each variable.
5. Optionally use **Print Result** for a report-friendly summary.

## What This Tool Represents

This web interface implements the **simplified scoring model** described in the manuscript, rather than the full continuous Cox model. It is intended to support:

- rapid bedside risk stratification
- standardized score calculation across centers
- supplementary research presentation
- code availability for the associated publication

## Naming and Presentation

To align the project with the manuscript and make it suitable for citation in academic writing, this repository uses:

- Browser title: **HCC Post-Hepatectomy Overall Survival Calculator**
- Main interface title: **HCC Post-Hepatectomy Overall Survival Risk Stratification**
- Subtitle: **Simplified Scoring Tool for Clinical Research**

Suggested manuscript link text:

- *HCC Post-Hepatectomy Overall Survival Calculator (web-based tool)*

## Local Development

To run locally:

1. Install dependencies with `npm install`
2. Start the development server with `npm run dev`
3. Open the local address shown by Vite

To build for deployment:

1. Run `npm run build`
2. Deploy the generated `dist` directory

## Code Availability

- Repository: [https://github.com/xuezhijingzhu/COX](https://github.com/xuezhijingzhu/COX)
- Online calculator: [https://cox-v1.pages.dev/](https://cox-v1.pages.dev/)

Recommended code availability wording:

> A web-based calculator implementing the simplified scoring model was developed to facilitate bedside use. The source code is publicly available at the project repository, and the online calculator is accessible via the deployed web interface.

## Clinical Use Statement

This calculator is intended for **research and educational use only** and should **not** replace clinical judgment.

## Citation

If this tool is cited in academic work, please cite the corresponding manuscript and include the web-tool link in the Code Availability section or Supplementary Material.
