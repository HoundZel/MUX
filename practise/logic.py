import math
import random
import copy

# num_of_input = input("Enter the number of input: ")
# num_of_select = math.log2(num_of_input)

# how to draw line above letter:
# print('a\u0304')



#let's simulate only 4 to 1 and 8 to 1 MUX for now 

# how to solve a MUX question:
# step1: draw the kmap 
# step2: Draw the MUX table since the input are 3 select and a input,
#         we can choose 3 select from 3 variables,can be any of the 4 var. 
#         in this case, choose b,c,d as s1,s2,s3
# step3: draw the diagram of mux 
# step4: check the kmap draw line vertically down as mirror and check the a determinant
# step5: transfer the logic to MUX 


#we use z(a,b,c,d) to represent the output of the MUX for now 

# inititated multiplexer config
num_of_input = random.choice([4, 8])
num_of_select = int(math.log2(num_of_input))

inputs = {}

for i in range(num_of_input):
    inputs["I"+str(i)] = 0

for j in range(num_of_select):
    inputs["S"+str(j)] = 0

z = {
    "A" : ['a','a\u0304'],
    "B" : ['b','b\u0304'],
    "C" : ['c','c\u0304'],
    "D" : ['d','d\u0304'],
    "binary" : ['0','1']
}

z_track = copy.deepcopy(z)

for i in inputs:
    if len(z_track) == 0:
        inputs[i] = random.choice(random.choice(list(z.values())))
    else:
        temp = random.choice(list(z_track.keys()))
        inputs[i] = random.choice(list(z_track.get(temp)))
        z_track.pop(temp)

print(inputs)

#size of kmap determined by the number of variables in z eg.z(a,b,c,d) = 2**4 = 16
kmap = []
# print(kmap)

#binary counter matching size of Inputs(I)
def binary_counter(n):
    return [bin(i)[2:].zfill(int(math.log2(n))) or '0' for i in range(n)]

truth_table = binary_counter(num_of_input)
# print(truth_table)

#step1: loop kmap in binary (abcd)
#step2: deep copy input dictionary and assign values to the unknown variables in select and input
#step3: use truth table to find output based off current mux variables in select and input
#step4: append output to kmap array 
#step5: discover the min and max term 

kmap_bin = binary_counter(2**(len(z)-1))
# print(kmap_bin)

for kmap_index in kmap_bin:
    curr_input = copy.deepcopy(inputs)
    curr_var_dict = {}
    abcd = {}
    for i in range(len(kmap_index)):
        abcd[chr(65+i)] = kmap_index[i]
    # print(abcd)