from django.core.management.base import BaseCommand
from blogCRUD.models import Blog


class Command(BaseCommand):
    help = 'Load the database with initial blog data'

    def handle(self, *args, **kwargs):
        blogs = [
            {
                'title': 'Top 5 Ecchi Anime List',
                'author': 'AnimeFan01',
                'body': (
                    '<h3>1. High School DxD</h3>'
                    '<p>A high school student finds himself surrounded by beautiful girls who are part of the supernatural world. Packed with action and fan service, it is a must-watch for ecchi lovers.</p>'
                    '<h3>2. To Love-Ru</h3>'
                    '<p>This romantic comedy follows the misadventures of Rito Yuuki as he deals with his crush and a number of alien girls who are interested in him. A great blend of humor and romance!</p>'
                    '<h3>3. Monster Musume</h3>'
                    '<p>A unique twist on the harem genre, this series features a boy living with various monster girls, each with their own quirks and personalities.</p>'
                    '<h3>4. Sekirei</h3>'
                    '<p>In a world where special beings called Sekirei can bond with humans, this series features action, romance, and plenty of ecchi moments.</p>'
                    '<h3>5. Heaven’s Lost Property</h3>'
                    '<p>When a boy finds a mysterious girl with wings, his life turns into a series of comedic and risqué adventures. This show is filled with hilarious and outrageous scenarios.</p>'
                )
            },
            {
                'title': 'Top 5 Action Movies',
                'author': 'MovieBuff99',
                'body': (
                    '<h3>1. Mad Max: Fury Road</h3>'
                    '<p>An exhilarating chase across a post-apocalyptic wasteland, this film redefined action cinema with its stunning visuals and relentless pace.</p>'
                    '<h3>2. John Wick</h3>'
                    '<p>This film follows a retired hitman seeking vengeance for the death of his dog, delivering intense action and a captivating world of assassins.</p>'
                    '<h3>3. The Dark Knight</h3>'
                    '<p>A masterclass in superhero filmmaking, this film features the iconic battle between Batman and the Joker, with unforgettable performances and a gripping story.</p>'
                    '<h3>4. Die Hard</h3>'
                    '<p>Often considered the quintessential action film, Bruce Willis stars as a New York cop trying to save hostages in a Los Angeles skyscraper on Christmas Eve.</p>'
                    '<h3>5. The Matrix</h3>'
                    '<p>This groundbreaking sci-fi action film explores the nature of reality and features mind-bending action sequences and a compelling storyline.</p>'
                )
            },
            {
                'title': 'Top 5 Anime Movies',
                'author': 'OtakuMaster',
                'body': (
                    '<h3>1. Spirited Away</h3>'
                    '<p>This Academy Award-winning film follows a young girl who gets trapped in a spirit world, where she must find a way to save her parents and return home.</p>'
                    '<h3>2. Your Name</h3>'
                    '<p>A beautiful tale of love and connection between two teenagers who inexplicably swap bodies. This film has captivated audiences worldwide.</p>'
                    '<h3>3. Akira</h3>'
                    '<p>A landmark in anime history, this film depicts a dystopian future and explores themes of power, corruption, and friendship.</p>'
                    '<h3>4. Ghost in the Shell</h3>'
                    '<p>This thought-provoking film delves into the nature of consciousness and identity in a cybernetic world, influencing countless works in the sci-fi genre.</p>'
                    '<h3>5. A Silent Voice</h3>'
                    '<p>A touching story about redemption and friendship, this film explores the effects of bullying and the journey to make amends.</p>'
                )
            }
        ]

        for blog_data in blogs:
            blog, created = Blog.objects.get_or_create(
                title=blog_data['title'],
                author=blog_data['author'],
                defaults={'body': blog_data['body']}
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f'Blog "{blog.title}" created successfully'))
            else:
                self.stdout.write(self.style.WARNING(f'Blog "{blog.title}" already exists'))
