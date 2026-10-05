export type SupportedLanguage = 'en' | 'te';

export interface TranslationSchema {
  nav: {
    brandSubtitle: string;
    tagline: string;
    subheadline: string;
    floorPlan: string;
    bookSession: string;
    callNow: string;
    whatsApp: string;
    openToday: string;
    floorPlanTitle: string;
    floorPlanSubtitle: string;
    walkthroughTitle: string;
  };
  zones: {
    entrance: {
      name: string;
      code: string;
      subhead: string;
      desc: string;
      badge: string;
      enterBtn: string;
      consultBtn: string;
      experience: string;
      sterile: string;
      certified: string;
      timing: string;
    };
    reception: {
      name: string;
      code: string;
      subhead: string;
      desc: string;
      exploreGallery: string;
      meetArtists: string;
      inspectStation: string;
      reserveConsultation: string;
    };
    gallery: {
      name: string;
      code: string;
      subhead: string;
      desc: string;
      filterAll: string;
      filterPortrait: string;
      filterBlackGrey: string;
      filterFineLine: string;
      filterMicroRealism: string;
      filterSacred: string;
      filterCoverUp: string;
      filterMinimal: string;
      filterFullBack: string;
      inspectBtn: string;
      requestSimilar: string;
      bookConsultation: string;
      zoomHint: string;
      resetZoom: string;
      verifiedBadge: string;
      placeholderBadge: string;
      caseStudyTitle: string;
      beforeAfterTitle: string;
    };
    artistDesk: {
      name: string;
      code: string;
      subhead: string;
      desc: string;
      principalTitle: string;
      bookWith: string;
      credentialsTitle: string;
      specialtiesTitle: string;
      experienceYears: string;
      startedAge: string;
    };
    tattooStation: {
      name: string;
      code: string;
      subhead: string;
      desc: string;
      sterilityPledge: string;
      singleUseBadge: string;
      bookService: string;
    };
    designTable: {
      name: string;
      code: string;
      subhead: string;
      desc: string;
      selectPlacement: string;
      sensitivity: string;
      flowAdvice: string;
      draftConceptBtn: string;
    };
    bookingArea: {
      name: string;
      code: string;
      subhead: string;
      desc: string;
      preferredArtist: string;
      tattooStyle: string;
      placement: string;
      approxSize: string;
      fullName: string;
      phone: string;
      email: string;
      preferredDate: string;
      conceptNotes: string;
      submitBtn: string;
      directDeskHotline: string;
      confirmedTitle: string;
      confirmWhatsApp: string;
    };
    aftercare: {
      name: string;
      code: string;
      subhead: string;
      desc: string;
      goldenRules: string;
      prohibitedRules: string;
    };
    finalExit: {
      name: string;
      code: string;
      subhead: string;
      desc: string;
      coordinatesTitle: string;
      directLine: string;
      officialEmail: string;
      walkthroughAgain: string;
      reserveNow: string;
    };
  };
  loader: {
    preparing: string;
    enterBtn: string;
  };
  common: {
    close: string;
    next: string;
    prev: string;
    loading: string;
    hours: string;
    artist: string;
    style: string;
    duration: string;
    technique: string;
    difficulty: string;
  };
}
