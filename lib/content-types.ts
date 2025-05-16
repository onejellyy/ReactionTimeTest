// 사이트 콘텐츠 타입 정의

// 홈페이지 콘텐츠
export interface HomeContent {
  hero: {
    title: string
    description: string
  }
  featuredWorks: {
    title: string
    description: string
  }
  artistIntro: {
    title: string
    description: string
  }
}

// 아티스트 소개 페이지 콘텐츠
export interface AboutContent {
  intro: {
    title: string
    description: string
  }
  bio: string
  exhibitions: {
    title: string
    description: string
  }
  artistStatement: string
}

// 연락처 페이지 콘텐츠
export interface ContactContent {
  title: string
  description: string
  address: string
  email: string
  phone: string
  hours: {
    weekdays: string
    saturday: string
    sunday: string
  }
  newsletter: {
    title: string
    description: string
    disclaimer: string
  }
}

// 갤러리 페이지 콘텐츠
export interface GalleryContent {
  title: string
  description: string
}

// 푸터 콘텐츠
export interface FooterContent {
  copyright: string
  socialLinks: {
    instagram: string
    twitter: string
  }
}

// 전체 사이트 콘텐츠
export interface SiteContent {
  home: HomeContent
  about: AboutContent
  contact: ContactContent
  gallery: GalleryContent
  footer: FooterContent
}

// 기본 사이트 콘텐츠
export const defaultSiteContent: SiteContent = {
  home: {
    hero: {
      title: "예술을 통한 새로운 시각",
      description:
        "독창적인 시각과 감성으로 만들어진 작품들을 소개합니다. 자연과 도시의 조화, 그리고 인간의 감정을 캔버스에 담아냅니다.",
    },
    featuredWorks: {
      title: "대표 작품",
      description: "최근 작업한 작품들을 소개합니다. 더 많은 작품은 갤러리에서 확인하세요.",
    },
    artistIntro: {
      title: "아티스트 소개",
      description:
        "2010년부터 활동을 시작한 현대 미술 작가로, 자연과 도시의 조화를 주제로 작업하고 있습니다. 국내외 다양한 전시회에 참여했으며, 여러 미술관에 작품이 소장되어 있습니다.",
    },
  },
  about: {
    intro: {
      title: "아티스트 소개",
      description: "2010년부터 활동을 시작한 현대 미술 작가로, 자연과 도시의 조화를 주제로 작업하고 있습니다.",
    },
    bio: '서울대학교 미술대학 서양화과를 졸업하고, 파리 국립 고등 미술학교에서 석사 학위를 취득했습니다. 자연과 도시의 조화, 인간의 감정과 사회적 관계를 주제로 작업하며, 회화, 사진, 설치 등 다양한 매체를 활용합니다.\n\n작품 활동 외에도 다양한 예술 교육 프로그램을 진행하며, 예술의 대중화와 접근성 향상을 위해 노력하고 있습니다. 국내외 여러 미술관과 갤러리에서 전시를 개최했으며, 다수의 작품이 주요 미술관에 소장되어 있습니다.\n\n"예술은 우리의 일상을 새롭게 바라보는 창문이 되어야 한다"는 철학을 바탕으로, 관람객들이 작품을 통해 자신의 삶과 주변 환경을 다시 생각해볼 수 있는 기회를 제공하고자 합니다.',
    exhibitions: {
      title: "전시 이력",
      description: "주요 전시 활동 및 수상 경력을 소개합니다.",
    },
    artistStatement:
      '"나의 작품은 자연과 도시, 인간과 환경 사이의 관계를 탐구합니다. 우리가 살아가는 공간과 그 안에서 형성되는 관계, 그리고 그것이 우리의 감정과 인식에 미치는 영향을 시각적으로 표현하고자 합니다. 색채와 형태를 통해 보이지 않는 감정과 에너지를 가시화하는 것이 나의 작업의 핵심입니다."',
  },
  contact: {
    title: "연락처",
    description: "작품 구매 문의, 전시 제안, 또는 기타 문의사항이 있으시면 연락 주세요.",
    address: "서울특별시 강남구 예술로 123, 아트 스튜디오 501호",
    email: "artist@example.com",
    phone: "02-123-4567",
    hours: {
      weekdays: "10:00 - 18:00",
      saturday: "11:00 - 16:00",
      sunday: "휴무",
    },
    newsletter: {
      title: "뉴스레터 구독",
      description: "새로운 작품 소식과 전시 일정을 이메일로 받아보세요.",
      disclaimer: "구독은 언제든지 취소할 수 있습니다. 개인정보는 안전하게 보호됩니다.",
    },
  },
  gallery: {
    title: "작품 갤러리",
    description: "모든 작품을 감상하고 구매하실 수 있습니다.",
  },
  footer: {
    copyright: "© {year} 아티스트 이름. All rights reserved.",
    socialLinks: {
      instagram: "Instagram",
      twitter: "Twitter",
    },
  },
}
