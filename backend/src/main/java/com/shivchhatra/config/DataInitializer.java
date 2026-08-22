package com.shivchhatra.config;

import com.shivchhatra.model.FortHeritage;
import com.shivchhatra.model.GalleryImage;
import com.shivchhatra.model.PaymentConfig;
import com.shivchhatra.repository.FortHeritageRepository;
import com.shivchhatra.repository.GalleryImageRepository;
import com.shivchhatra.repository.PaymentConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private PaymentConfigRepository paymentConfigRepository;

    @Autowired
    private GalleryImageRepository galleryImageRepository;

    @Autowired
    private FortHeritageRepository fortHeritageRepository;

    @Override
    public void run(String... args) throws Exception {
        seedPaymentConfig();
        seedForts();
        // Clear any old demo gallery photos permanently so user starts with 0
        if (galleryImageRepository.count() > 0) {
            List<GalleryImage> all = galleryImageRepository.findAll();
            for (GalleryImage g : all) {
                if (g.getId().startsWith("gal-") && !g.getId().startsWith("gal-17")) {
                    galleryImageRepository.delete(g);
                }
            }
        }
        System.out.println("✅ Shivchhatra Trekkers Enterprise Backend Initialized with Dynamic Forts Support");
    }

    private void seedPaymentConfig() {
        if (paymentConfigRepository.count() == 0) {
            PaymentConfig config = new PaymentConfig();
            config.setId("default");
            config.setMerchantName("Shivchhatra Trekkers (Ravindra Chavan)");
            config.setUpiId("7447661921@hdfc");
            config.setMerchantPhone("+91 74476 61921");
            config.setAccountHolder("RAVINDRA LAXMAN CHAVAN");
            config.setBankName("HDFC Bank");
            config.setCustomScannerImage("/payment_scanner.jpg");
            config.setEnableCustomScanner(true);
            config.setEnableDynamicQR(true);
            config.setPermitFee(100);
            config.setSecurityNotice("Verified Official Sahyadri Adventure Portal. Scan through any UPI App (GPay, PhonePe, Paytm, BHIM, CRED).");
            paymentConfigRepository.save(config);
            System.out.println("✅ Seeded official Payment Configuration with HDFC UPI 7447661921@hdfc");
        }
    }

    private void seedForts() {
        // Sync or seed historical forts with authentic real photos
        List<FortHeritage> initialForts = Arrays.asList(
                new FortHeritage(
                        "fort-rajgad",
                        "Rajgad (राजगड)",
                        "The King of Forts (राजांचा राजा)",
                        "Chhatrapati Shivaji Maharaj's royal capital for over 26 years. The birthplace of Rajaram Maharaj and the epicenter of Swarajya's early victories.",
                        "4,514 ft / 1,376 m",
                        "Moderate to Hard",
                        "Gunjavane / Pali (Pune)",
                        "July to February (Monsoon & Winter)",
                        "https://upload.wikimedia.org/wikipedia/commons/4/49/Suvela_machi%2CRajgad_fort%2C_Maharashtra%2CIndia_July2015.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
                        Arrays.asList(
                                "Padmavati Machi & Temple",
                                "Sanjeevani Machi (Double-layered Bastion Ridge)",
                                "Suvela Machi & Nedhe (Rock Needle)",
                                "Balekilla (Unconquered Highest Citadel)"
                        ),
                        "Shivaji Maharaj considered Rajgad the most impregnable fort in Hindustan. Its triangular formation and sheer drop cliffs made it impenetrable to Mughal armies."
                ),
                new FortHeritage(
                        "fort-raigad",
                        "Raigad (दुर्गराज रायगड)",
                        "The Capital of Swarajya (स्वराज्याची राजधानी)",
                        "Site of Chhatrapati Shivaji Maharaj's historic Royal Coronation (Rajyabhishek) in 1674 and his holy final resting place (Samadhi).",
                        "2,700 ft / 820 m",
                        "Easy to Moderate (Steps & Cable Car)",
                        "Pachad (Mahad, Raigad)",
                        "All Year Round (Special in Monsoon & Winter)",
                        "https://media.assettype.com/deccanherald%2F2024-07%2Ff8303050-1a25-4fad-ad30-a3788ff1b8be%2FPTI06_02_2023_000198B.jpg?rect=0%2C0%2C4800%2C2700&w=undefined&auto=format%2Ccompress&fit=max",
                        Arrays.asList(
                                "Rajsabha (Royal Court with Acoustic Marvel)",
                                "Shivaji Maharaj Samadhi & Jagdishwar Temple",
                                "Hirkani Buruj & Takmak Tok",
                                "Maha Darwaja & Mena Darwaja"
                        ),
                        "Designed by Master Architect Hiroji Indulkar, Raigad was built as an invincible capital surrounded by deep Sahyadri valleys and dense forests."
                ),
                new FortHeritage(
                        "fort-torna",
                        "Torna / Prachandagad (तोरणा)",
                        "The First Fort of Swarajya (स्वराज्याची पहिली तोरण)",
                        "Captured by Shivaji Maharaj at the young age of 16 in 1646, marking the founding declaration of Hindavi Swarajya.",
                        "4,603 ft / 1,403 m",
                        "Hard & Steep",
                        "Velhe (Pune)",
                        "August to January",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT4EPyREDrqJTstd5Bbh6n3J_vKSxVXAstb6gTEk4s13w&s=10",
                        Arrays.asList(
                                "Zunjar Machi (Razor-edge cliff ridge)",
                                "Budhla Machi (Massive rock bastion)",
                                "Mengai Devi Temple & Kothi",
                                "Bini Darwaja & Kothi Darwaja"
                        ),
                        "Torna is named 'Prachandagad' due to its sheer massive geographical perimeter. Gold discovered during its renovation helped finance the building of Rajgad."
                ),
                new FortHeritage(
                        "fort-harishchandragad",
                        "Harishchandragad (हरिश्चंद्रगड)",
                        "The Wonder of Sahyadris (सह्याद्रीचे वैभव)",
                        "Ancient fort with 6th-century stone carvings, mythological roots, and the world's most spectacular concave cliff, Konkan Kada.",
                        "4,665 ft / 1,422 m",
                        "Moderate to Challenging",
                        "Khireshwar / Pachnai (Ahmednagar)",
                        "September to March",
                        "https://pbs.twimg.com/media/FjbW9oKVIAEBwg1.jpg",
                        Arrays.asList(
                                "Konkan Kada (1,800ft Concave Cliff)",
                                "Kedareshwar Cave & 4 Pillars of Yugas",
                                "Harishchandreshwar Temple (Hemadpanthi)",
                                "Taramati Peak (Maharashtra's 3rd Highest)"
                        ),
                        "Mentioned in ancient Puranas (Matsyapurana), this fort was held by the Kalachuri and Maratha dynasties as a strategic lookout point over Konkan."
                ),
                new FortHeritage(
                        "fort-sinhagad",
                        "Sinhagad (सिंहगड / कोंढाणा)",
                        "The Lion's Fort (सिंहाचा गड)",
                        "Immortalized by the legendary battle of 1670 where Subedar Tanaji Malusare sacrificed his life to recapture Kondhana for Swarajya.",
                        "4,320 ft / 1,317 m",
                        "Easy to Moderate",
                        "Atkarwadi / Donje (Pune)",
                        "Monsoon & Winter",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSUwpZ27Mbq-g5D6A605oEjPmXDlvuwOuyiYnmRbX6V4YzwBCJAPF9NTm0&s=10",
                        Arrays.asList(
                                "Tanaji Malusare Samadhi & Memorial",
                                "Kalyan Darwaja & Pune Darwaja",
                                "Zunjar Machi & Devtaki (Pure Springs)",
                                "Lokmanya Tilak Bungalow"
                        ),
                        "'Gad aala pan sinh gela' (We won the fort, but lost our lion) was Shivaji Maharaj's famous lament upon Tanaji's supreme sacrifice here."
                ),
                new FortHeritage(
                        "fort-harihar",
                        "Harihar Fort / Harshagad (हरिहर गड)",
                        "The Rock Staircase Fort (प्रस्तर पायऱ्यांचा गड)",
                        "An architectural marvel featuring 80-degree vertical stone staircase carved directly into sheer granite rocks.",
                        "3,676 ft / 1,120 m",
                        "Thrilling & Steep",
                        "Harshewadi / Nirgudpada (Nashik)",
                        "October to February",
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXxFh3tmnWMYk3NQASn0lk0rMta4yOak_Qlz3G6IotANzwj5AaL0Fitb0P&s=10",
                        Arrays.asList(
                                "80-degree Vertical Rock Staircase",
                                "Scottish Fall & Mahadarwaja",
                                "Hanuman & Shiva Temple Caves",
                                "Pushti Lake & Water Cisterns"
                        ),
                        "Built during the Seuna (Yadava) dynasty between the 9th and 14th centuries, Harihar was essential for guarding the trade route through Gonda Ghat."
                ),
                new FortHeritage(
                        "fort-pratapgad",
                        "Pratapgad (प्रतापगड)",
                        "The Valour Fort of Afzal Khan Victory (शौर्यदुर्ग)",
                        "Built by Moropant Pingle under Shivaji Maharaj in 1656. Famous for the historic clash and crushing defeat of Afzal Khan on November 10, 1659.",
                        "3,543 ft / 1,080 m",
                        "Easy to Moderate",
                        "Kumbhroshi / Mahabaleshwar (Satara)",
                        "July to February",
                        "https://www.yes.edu.in/images/attractions/Pratapgad-Fort.jpg",
                        Arrays.asList(
                                "Bhavani Mata Mandir (Consecrated by Shivaji Maharaj)",
                                "Afzal Khan Tomb & Memorial",
                                "Kedareshwar Temple & Ballekilla",
                                "Tehlani Buruj & Double-rampart Bastions"
                        ),
                        "Surrounded by dense Jawali forests, Pratapgad stands as the supreme symbol of Maratha intelligence, diplomacy, and battlefield valor."
                ),
                new FortHeritage(
                        "fort-panhala",
                        "Panhala / Panhalgad (दुर्गराज पन्हाळगड)",
                        "The Great Siege & Shiva Kashid's Martyrdom (दक्षिण भारताची चावी)",
                        "Legendary site of Shivaji Maharaj's midnight escape to Vishalgad through the Siddi Jauhar siege in 1660, aided by Shiva Kashid and Baji Prabhu Deshpande.",
                        "2,756 ft / 840 m",
                        "Easy to Moderate",
                        "Panhala Town (Kolhapur)",
                        "Year Round (Monsoon to Winter)",
                        "https://www.mtdc.co.in/wp-content/uploads/2020/01/panhala-fort-kolhapur.jpg",
                        Arrays.asList(
                                "Sajja Kothi & Teen Darwaza",
                                "Ambarkhana Granaries (Ganga, Yamuna, Saraswati)",
                                "Andhar Bavadi (Hidden Stepwell)",
                                "Shiva Kashid & Baji Prabhu Memorials"
                        ),
                        "Panhala is one of the largest forts in the Deccan, serving as the southern headquarters of Queen Tarabai and the Maratha Empire."
                ),
                new FortHeritage(
                        "fort-salher",
                        "Salher Fort (साल्हेर किल्ला)",
                        "Highest Fort in Maharashtra & Site of Epic 1672 Battle (सर्वोच्च दुर्ग)",
                        "The highest hill fort in Maharashtra (5,141 ft). Site of the monumental 1672 Battle of Salher where the Maratha army routed the Mughal imperial forces in an open-field battle.",
                        "5,141 ft / 1,567 m",
                        "Moderate to Challenging",
                        "Waghamba / Salher Village (Baglan, Nashik)",
                        "October to March",
                        "https://upload.wikimedia.org/wikipedia/commons/4/49/Suvela_machi%2CRajgad_fort%2C_Maharashtra%2CIndia_July2015.jpg?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=original",
                        Arrays.asList(
                                "Parshuram Temple & Cave Complexes",
                                "Ganesh Darwaza & Massive Gateway Arches",
                                "Gangasagar & Yamunasagar Lakes",
                                "Summit Flag Pinnacle (Highest Point in Sahyadri Forts)"
                        ),
                        "The Battle of Salher in 1672 was the first open-pitch battlefield victory of the Marathas against the Mughal Empire, establishing Swarajya as a dominant military power."
                )
        );
        fortHeritageRepository.saveAll(initialForts);
        System.out.println("✅ Seeded 9 Historical Sacred Forts with authentic real images");
    }
}
