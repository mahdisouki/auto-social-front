import { Link } from 'react-router-dom';
import { useState } from 'react';
import vectorLogo from '../assets/postoruai.png';
import worldIcon from '../assets/world.png';
import tikIcon from '../assets/tik.png';
import instaIcon from '../assets/insta.png';
import fbIcon from '../assets/fb.png';
import card1 from '../assets/card1.png';
import card2 from '../assets/card2.png';
import card3 from '../assets/card3.png';
import connLeft from '../assets/conn.png';
import connRight from '../assets/conn2.png';
import tsawerImage from '../assets/tsawer.png';
import circle1 from '../assets/circle1.png';

const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden font-['Poppins']" style={{ fontFamily: 'Poppins, sans-serif', background: '#000000' }}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md shadow-sm" style={{ background: '#000000' }}>
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-4 md:gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 flex items-center justify-center">
                <img src={vectorLogo} alt="Postora Logo" className="w-full h-full object-contain" />
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 lg:space-x-6 xl:space-x-8 flex-1 justify-center">
              <a href="#accueil" className="text-white hover:text-purple-400 transition-colors whitespace-nowrap" style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif' }}>
                Accueil
              </a>
              <a href="#solution" className="text-white hover:text-purple-400 transition-colors whitespace-nowrap" style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif' }}>
                Solution
              </a>
              <a href="#tarifs" className="text-white hover:text-purple-400 transition-colors whitespace-nowrap" style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif' }}>
                Tarifs
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-1.5 sm:space-x-2 md:space-x-3 lg:space-x-4 flex-shrink-0">
              <Link 
                to="/login" 
                className="text-white hover:text-purple-400 transition-colors font-medium whitespace-nowrap"
                style={{ fontSize: '10px', fontFamily: 'Inter, sans-serif' }}
              >
                <span className="hidden sm:inline">Se connecter</span>
                <span className="sm:hidden">Connexion</span>
              </Link>
              <Link 
                to="/signup" 
                className="bg-[#9333EA] text-white px-2 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 hover:bg-purple-700 transition-colors font-medium whitespace-nowrap"
                style={{ borderRadius: '16px', fontSize: '10px', fontFamily: 'Inter, sans-serif' }}
              >
                S'inscrire
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main 
        className="pt-32 px-4 sm:px-6 lg:px-8 min-h-screen"
        style={{
          background: '#000000'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Social Icons with Connection Lines - Top Left */}
          <div className="absolute top-62 left-10 lg:left-20" style={{ zIndex: 200 }}>
            <div className="relative" style={{ zIndex: 200 }}>
              {/* TikTok Icon */}
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-float" style={{ zIndex: 201 }}>
                <img src={tikIcon} alt="TikTok" className="w-10 h-10" />
              </div>
            </div>
          </div>
          
          {/* Connection Lines - Left Side */}
          <img 
            src={connLeft} 
            alt="Connection Lines Left" 
            className="absolute pointer-events-none"
            style={{ 
              top: '8rem',
              left: '-8rem',
              width: '40rem',
              height: '40rem',
              opacity: 0.5,
              zIndex: 10,
              objectFit: 'contain'
            }}
          />

          {/* Globe Icon - Top Left Secondary */}
          <div className="absolute top-100 left-20 lg:left-32 w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-float-delayed" style={{ zIndex: 200 }}>
            <img src={worldIcon} alt="World" className="w-10 h-10" />
          </div>

          {/* Instagram Icon - Top Right */}
          <div className="absolute top-60 right-10 lg:right-20" style={{ zIndex: 200 }}>
            <div className="relative" style={{ zIndex: 200 }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-float" style={{ zIndex: 201 }}>
                <img src={instaIcon} alt="Instagram" className="w-10 h-10" />
              </div>
            </div>
          </div>
          
          {/* Connection Lines - Right Side */}
          <img 
            src={connRight} 
            alt="Connection Lines Right" 
            className="absolute pointer-events-none"
            style={{ 
              top: '8rem',
              right: '-6rem',
              width: '40rem',
              height: '40rem',
              opacity: 0.5,
              zIndex: 10,
              objectFit: 'contain'
            }}
          />

          {/* Facebook Icon - Right Side */}
          <div className="absolute top-110 right-16 lg:right-32 w-10 h-10 rounded-full flex items-center justify-center shadow-lg animate-float-delayed" style={{ zIndex: 200 }}>
            <img src={fbIcon} alt="Facebook" className="w-10 h-10" />
          </div>

          {/* Main Content */}
          <div className="text-center max-w-4xl mx-auto relative z-10">
            {/* Image layer under the texts */}
            <img 
              src={circle1} 
              alt="" 
              className="absolute left-1/2 -translate-x-1/2 top-0 w-full max-w-6xl min-h-[420px] h-auto object-contain pointer-events-none" 
              style={{ zIndex: 0 }}
            />
            <div className="relative" style={{ zIndex: 1 }}>
              <h1 
                className="mb-6"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 400,
                  fontStyle: 'italic',
                  fontSize: '70px',
                  lineHeight: '125%',
                  letterSpacing: '4%',
                  textAlign: 'center',
                  textTransform: 'capitalize'
                }}
              >
                <span className="bg-[#9333EA] bg-clip-text text-transparent">
                  Créez, Améliorez Et Publiez
                </span>
                <br />
                <span className="text-white">
                  Vos Contenus Plus Facilement
                </span>
              </h1>

              <p 
                className="mb-8 max-w-2xl mx-auto"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '20px',
                  lineHeight: '140%',
                  letterSpacing: '5%',
                  textAlign: 'center',
                  color: '#4B5563'
                }}
              >
                Créez des visuels, écrivez des légendes et programmez vos publications
                sur les réseaux sociaux grâce à l'IA, en quelques clics
              </p>

              <Link 
                to="/dashboard" 
                className="inline-block bg-[#9333EA] text-white px-8 py-4 rounded-2xl text-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105"
                style={{
                  boxShadow: '0px 0px 27.1px 0px #9747FF8A'
                }}
              >
                Créer Et Publier Maintenant
              </Link>
            </div>

            {/* Bottom Social Icons */}
           
          </div>
          
        </div>
        <div className="w-screen pt-35 -mx-4 sm:-mx-6 lg:-mx-8">
              <img src={tsawerImage} alt="Social Media Icons" className="w-full h-auto object-contain max-h-[80vh]" />
          </div>
      </main>

      {/* Why Postora AI Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8" 
        style={{ 
          fontFamily: 'Poppins, sans-serif',
          background: '#D6B9FE',
          boxShadow: '0px -42px 14.7px 0px #0000002B'
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 
              className="mb-4"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                fontStyle: 'italic',
                fontSize: '64px',
                lineHeight: '110%',
                letterSpacing: '-1%',
                textTransform: 'capitalize',
                textAlign: 'center'
              }}
            >
              POURQUOI <span className="text-[#9333EA]">POSTORA AI</span> ?
            </h2>
            <p 
              className="max-w-3xl mx-auto"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                fontStyle: 'normal',
                fontSize: '20px',
                lineHeight: '100%',
                letterSpacing: '5%',
                textAlign: 'center',
                color: '#4B5563'
              }}
            >
              Postora AI vous aide à gérer, améliorer et programmer vos contenus pour les réseaux sociaux et le web sans perte de temps
            </p>
          </div>

          {/* Cards Grid */}
          <div className="mb-20">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="rounded-2xl overflow-hidden relative" style={{ background: '#C098F5' }}>
                {/* Number Badge */}
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black flex items-center justify-center z-10">
                  <span className="text-white font-bold text-lg">1</span>
                </div>
                <div className="flex justify-center pt-18">
                  <img src={card1} alt="Card 1" className="w-[90%] h-auto object-cover" />
                </div>
                <div className="p-6">
                  <h3 
                    className="mb-3"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      fontSize: '30px',
                      lineHeight: '32px',
                      letterSpacing: '0.6px',
                      verticalAlign: 'middle'
                    }}
                  >
                    Générer Du Contenu
                  </h3>
                  <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif',fontWeight: 400 }}>
                    Transformez vos idées brutes en visuels publicitaires professionnels en quelques secondes grâce à notre IA de pointe.
                  </p>
                </div>
              </div>
              
              {/* Card 2 */}
              <div className="rounded-2xl overflow-hidden relative" style={{ background: '#C098F5' }}>
                {/* Number Badge */}
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black flex items-center justify-center z-10">
                  <span className="text-white font-bold text-lg">2</span>
                </div>
                <div className="flex justify-center pt-28">
                  <img src={card2} alt="Card 2" className="w-[90%] h-auto object-cover" />
                </div>
                <div className="p-6 pt-15">
                  <h3 
                    className="mb-3"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      fontSize: '30px',
                      lineHeight: '32px',
                      letterSpacing: '0.6px',
                      verticalAlign: 'middle'
                    }}
                  >
                    Multi-Réseaux
                  </h3>
                  <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif',fontWeight: 400 }}>
                    Gérez tous vos réseaux sociaux depuis une seule plateforme. Planifiez vos publications à l'avance et publiez automatiquement.
                  </p>
                </div>
              </div>
              
              {/* Card 3 */}
              <div className="rounded-2xl overflow-hidden relative" style={{ background: '#C098F5' }}>
                {/* Number Badge */}
                <div className="absolute top-4 left-4 w-8 h-8 rounded-full bg-black flex items-center justify-center z-10">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div className="flex justify-center pt-20">
                  <img src={card3} alt="Card 3" className="w-[70%] h-auto object-cover" />
                </div>
                <div className="p-6">
                  <h3 
                    className="mb-3"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontWeight: 700,
                      fontStyle: 'italic',
                      fontSize: '30px',
                      lineHeight: '32px',
                      letterSpacing: '0.6px',
                      verticalAlign: 'middle'
                    }}
                  >
                    Optimiser & Analyser
                  </h3>
                  <p className="text-gray-800 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif',fontWeight: 400 }}>
                    Analysez les performances de vos contenus et optimisez votre stratégie grâce à des insights détaillés et des recommandations personnalisées.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative" style={{ fontFamily: 'Poppins, sans-serif', background: '#000000' }}>
        {/* Right Gradient Background - Circular */}
        <div 
          className="absolute pointer-events-none"
          style={{
            right: '-20%',
            top: '10%',
            width: '800px',
            height: '700px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(151, 71, 255, 0.2) 0%, rgba(151, 71, 255, 0.05) 50%, transparent 70%)',
            backdropFilter: 'blur(800px)',
            WebkitBackdropFilter: 'blur(800px)',
            zIndex: 0,
            maskImage: 'radial-gradient(circle, black 0%, black 60%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle, black 0%, black 60%, transparent 80%)',
            filter: 'blur(60px)',
            WebkitFilter: 'blur(60px)'
          }}
        ></div>
        <div className="max-w-7xl mx-auto relative" style={{ zIndex: 10 }}>
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 
              className="text-white mb-4"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                fontStyle: 'italic',
                fontSize: '42px',
                lineHeight: '110%',
                letterSpacing: '-1%',
                textTransform: 'capitalize'
              }}
            >
              ILS NOUS FONT CONFIANCE
            </h2>
            <p className="text-white text-md">
              Postora AI vous aide à générer, améliorer et programmer vos contenus pour les réseaux sociaux et le web, sans perdre de temps.
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div 
              className="rounded-2xl p-8 hover:shadow-lg transition-shadow"
              style={{
                background: '#0E0E13',
                border: '1px solid #FFFFFF33'
              }}
            >
              <p className="text-white text-sm mb-8 leading-relaxed">
                "Lorem ipsum dolor sit amet. Aut adipisci quibusdam sed quidem odio ut mollitia voluptatem est corrupti voluptate est dolorum galisum et illo omnis? "
              </p>
              
              <div className="border-t border-gray-600 mb-6"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">SAIF BEN MASSOUDA</p>
                  <p className="text-gray-400 text-xs">TOUSIX INFORMATIK</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div 
              className="rounded-2xl p-8 hover:shadow-lg transition-shadow"
              style={{
                background: '#0E0E13',
                border: '1px solid #FFFFFF33'
              }}
            >
              <p className="text-white text-sm mb-8 leading-relaxed">
                "Lorem ipsum dolor sit amet. Aut adipisci quibusdam sed quidem odio ut mollitia voluptatem est corrupti voluptate est dolorum galisum et illo omnis? "
              </p>
              
              <div className="border-t border-gray-600 mb-6"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">SAIF BEN MASSOUDA</p>
                  <p className="text-gray-400 text-xs">TOUSIX INFORMATIK</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div 
              className="rounded-2xl p-8 hover:shadow-lg transition-shadow"
              style={{
                background: '#0E0E13',
                border: '1px solid #FFFFFF33'
              }}
            >
              <p className="text-white text-sm mb-8 leading-relaxed">
                "Lorem ipsum dolor sit amet. Aut adipisci quibusdam sed quidem odio ut mollitia voluptatem est corrupti voluptate est dolorum galisum et illo omnis? "
              </p>
              
              <div className="border-t border-gray-600 mb-6"></div>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <svg className="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-white">SAIF BEN MASSOUDA</p>
                  <p className="text-gray-400 text-xs">TOUSIX INFORMATIK</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ fontFamily: 'Poppins, sans-serif', background: '#000000' }}>
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 
              className="mb-4 text-white"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontWeight: 700,
                fontStyle: 'italic',
                fontSize: '64px',
                lineHeight: '110%',
                letterSpacing: '-1%',
                textTransform: 'capitalize'
              }}
            >
              TARIFS
            </h2>
            <p className="text-white max-w-3xl mx-auto">
              Que vous soyez créateur, freelance ou entreprise, Postora AI s'adapte à votre rythme.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <div 
              className="rounded-2xl p-8 hover:shadow-lg transition-shadow transform scale-95"
              style={{
                background: '#0E0E13',
                border: '1px solid #FFFFFF33'
              }}
            >
              <h3 className="text-2xl font-bold mb-2 text-white">Lorem</h3>
              <p className="text-gray-300 text-sm mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">99</span>
                <span className="text-[#878787] text-xl font-bold">Dt/mois</span>
              </div>

              <button 
                className="w-full py-3 rounded-lg font-semibold transition-colors mb-6"
                style={{
                  border: '1px solid #9747FF',
                  color: '#9747FF',
                  background: 'transparent'
                }}
              >
                Commencer maintenant
              </button>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
              </ul>
            </div>

            {/* Premium Plan - Highlighted */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-[#9333EA] hover:shadow-xl transition-shadow relative">
              <h3 className="text-2xl font-bold mb-2">Lorem</h3>
              <p className="text-gray-600 text-sm mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              
              <div className="mb-6">
                <span className="text-5xl text-black font-bold">99</span>
                <span className="text-black text-2xl font-bold">Dt/mois</span>
              </div>

              <button className="w-full bg-[#9333EA] text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors mb-6">
                Commencer maintenant
              </button>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
              </ul>
            </div>

            {/* Enterprise Plan */}
            <div 
              className="rounded-2xl p-8 hover:shadow-lg transition-shadow transform scale-95"
              style={{
                background: '#0E0E13',
                border: '1px solid #FFFFFF33'
              }}
            >
              <h3 className="text-2xl font-bold mb-2 text-white">Lorem</h3>
              <p className="text-gray-300 text-sm mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              
              <div className="mb-6">
                <span className="text-5xl font-bold text-white">99</span>
                <span className="text-[#878787] text-xl font-bold">Dt/mois</span>

              </div>

              <button 
                className="w-full py-3 rounded-lg font-semibold transition-colors mb-6"
                style={{
                  border: '1px solid #9747FF',
                  color: '#9747FF',
                  background: 'transparent'
                }}
              >
                Commencer maintenant
              </button>

              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[#9333EA] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-300 text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ and Footer Container */}
      <div className="relative" style={{ background: '#000000' }}>
        {/* Left Gradient Background - Circular */}
        <div 
          className="absolute pointer-events-none"
          style={{
            left: '-10%',
            top: '20%',
            width: '500px',
            height: '800px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(151, 71, 255, 0.2) 0%, rgba(151, 71, 255, 0.05) 50%, transparent 70%)',
            backdropFilter: 'blur(800px)',
            WebkitBackdropFilter: 'blur(800px)',
            zIndex: 0,
            maskImage: 'radial-gradient(circle, black 0%, black 60%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(circle, black 0%, black 60%, transparent 80%)',
            filter: 'blur(60px)',
            WebkitFilter: 'blur(60px)'
          }}
        ></div>

      {/* FAQ Section */}
      <section 
        className="py-20 px-4 sm:px-6 lg:px-8 relative" 
        style={{ 
          fontFamily: 'Poppins, sans-serif', 
          background: 'transparent',
          zIndex: 10
        }}
      >
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-start">
            {/* Section Header */}
            <div className="flex-shrink-0 md:w-1/3">
              <h2 
                className="mb-4 text-white"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontWeight: 400,
                  fontStyle: 'normal',
                  fontSize: '60px',
                  lineHeight: '110%',
                  letterSpacing: '-1%',
                  textTransform: 'capitalize'
                }}
              >
                QUESTIONS FRÉQUENTES
              </h2>
            </div>

            {/* FAQ Items */}
            <div className="flex-1 space-y-4 w-full md:w-2/3">
            <FAQItem 
              question="Qu'est-ce que Postora AI ?"
              answer="Postora AI est une plateforme qui utilise l'intelligence artificielle pour générer, améliorer et programmer automatiquement vos contenus pour les réseaux sociaux et le web. Elle permet de créer des visuels, d'optimiser vos contenus et de planifier vos publications depuis un seul outil, afin de gagner du temps et de publier plus efficacement."
              defaultOpen={true}
            />
            <FAQItem 
              question="À qui s'adresse Postora AI ?"
              answer="Postora AI est conçu pour les créateurs de contenu, les freelances, les petites entreprises et les agences qui souhaitent optimiser leur présence sur les réseaux sociaux."
            />
            <FAQItem 
              question="Postora AI peut-il publier automatiquement sur les réseaux sociaux ?"
              answer="Oui, Postora AI permet de programmer et de publier automatiquement vos contenus sur plusieurs réseaux sociaux selon le calendrier que vous définissez."
            />
            <FAQItem 
              question="Ai-je besoin de compétences en design ou en marketing ?"
              answer="Non, Postora AI est conçu pour être accessible à tous, sans compétences techniques requises. L'IA vous guide dans la création de contenus professionnels."
            />
            <FAQItem 
              question="Puis-je utiliser les contenus générés à des fins commerciales ?"
              answer="Oui, tous les contenus générés par Postora AI peuvent être utilisés librement à des fins commerciales."
            />
            <FAQItem 
              question="Postora AI fonctionne-t-il avec plusieurs réseaux sociaux ?"
              answer="Oui, Postora AI est compatible avec les principales plateformes de réseaux sociaux pour faciliter la gestion multi-canal."
            />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ fontFamily: 'Poppins, sans-serif', background: 'transparent', position: 'relative', zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-row items-center justify-between">
            {/* Logo */}
            <div className="w-32 h-10">
              <img src={vectorLogo} alt="Postora AI" className="w-full h-full object-contain object-left" />
            </div>

            {/* Social Icons */}
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 flex items-center justify-center  transition-colors">
                  <img src={tikIcon} alt="TikTok" className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center transition-colors">
                  <img src={instaIcon} alt="Instagram" className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center  transition-colors">
                  <img src={fbIcon} alt="Facebook" className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity" />
                </a>
                <a href="#" className="w-10 h-10 flex items-center justify-center  transition-colors">
                  <svg className="w-5 h-5 opacity-60 hover:opacity-100 transition-opacity text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
              </div>
              <Link 
                to="/privacy"
                onClick={() => window.scrollTo(0, 0)}
                className="text-white hover:text-purple-400 transition-colors"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  fontWeight: 200,
                  textDecoration: 'underline',
                  textDecorationColor: '#000000',
                  textAlign: 'center'
                }}
              >
                Politiques et Conditions
              </Link>
              <Link 
                to="/terms"
                onClick={() => window.scrollTo(0, 0)}
                className="text-white hover:text-purple-400 transition-colors"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '10px',
                  fontWeight: 200,
                  textDecoration: 'underline',
                  textDecorationColor: '#000000',
                  textAlign: 'center'
                }}
              >
                Terms et conditions
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright Bar */}
        <div className="bg-[#9333EA] py-3">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-white text-center text-sm">
              © 2025 POSTORA AI
            </p>
          </div>
        </div>
      </footer>
      </div>

      {/* Decorative Elements */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float 3s ease-in-out infinite;
          animation-delay: 1.5s;
        }

        /* Hide scrollbar */
        body::-webkit-scrollbar {
          display: none;
        }
        
        body {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

// FAQ Item Component
const FAQItem = ({ question, answer, defaultOpen = false }: { question: string; answer: string; defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border border-gray-600 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-800 transition-colors"
      >
        <span className="font-semibold text-base pr-4 text-white">{question}</span>
        <svg
          className={`w-6 h-6 flex-shrink-0 transition-transform text-white ${isOpen ? 'rotate-45' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-gray-300 text-sm leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};

export default LandingPage;
