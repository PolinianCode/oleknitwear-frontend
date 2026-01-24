import Image from 'next/image';

export default function OurStory() {
    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
                
                    <div className="relative h-[600px] lg:h-[700px] overflow-hidden shadow-lg">
                        <Image
                            src="/images/about.jpg"
                            alt="Rose Carmine Founder"
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>

                    {/* Text Content */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold tracking-tight mb-8 text-center lg:text-left font-sans">
                            OUR STORY
                        </h2>
                        
                        <div className="space-y-6 text-sm font-normal text-gray-600 leading-relaxed">
                            <p className="transition-all duration-300 hover:text-gray-900 font-barlow">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis, 
                                praesentium tempore. Voluptatibus, vero maiores sed, facilis omnis 
                                praesentium, quasi est minus earum aliquam eligendi provident repellendus 
                                quae porro quibusdam sit?
                            </p>
                            
                            <p className="transition-all duration-300 hover:text-gray-900 font-barlow">
                                Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vitae modi fugit nulla 
                                iusto provident, voluptatibus molestiae ad quae ducimus illo dignissimos 
                                explicabo repellendus assumenda minima maxime consequatur obcaecati ab id.
                            </p>
                            
                            <p className="transition-all duration-300 hover:text-gray-900 font-barlow">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Perferendis 
                                dignissimos commodi, inventore ad sed similique dolores vero animi, distinctio 
                                libero doloremque! Incidunt ut at illum blanditiis alias saepe obcaecati ex!
                            </p>
                        </div>

                        <p className="text-base font-medium text-brand pt-6 transition-all duration-300 font-barlow">
                            Olesia Bruskova - Founder of Ole Knitwear
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
