from pydantic import BaseModel


class PageResponse(BaseModel):
    slug: str
    title: str
    hero_title: str
    hero_subtitle: str
    body: str


class ProgramSummary(BaseModel):
    slug: str
    title: str
    description: str
    stat: str


class StorySummary(BaseModel):
    name: str
    role: str
    quote: str


class EventSummary(BaseModel):
    title: str
    date: str
    location: str
    description: str


class BlogSummary(BaseModel):
    category: str
    title: str
    excerpt: str
