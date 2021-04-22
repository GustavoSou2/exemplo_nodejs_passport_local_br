import json
from json import JSONEncoder


class Aluno:
    def __init__(self, RM, name):
        self.RM = RM
        self.name = name


class Curso:
    def __init__(self, cod, aluno ,teacher):
        self.cod = cod
        self.aluno = aluno
        self.teacher = teacher


# subclass JSONEncoder
class EmployeeEncoder(JSONEncoder):
    def default(self, o):
        return o.__dict__


aluno = Aluno("31000", "Gustavo de Souza")
employee = Curso(1 , aluno, "Felipe")


print("Imprimindo as informações de cada função")
print("-" * 90)
print(EmployeeEncoder().encode(employee))