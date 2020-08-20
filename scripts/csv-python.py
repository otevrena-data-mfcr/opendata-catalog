# Load the Pandas library with alias 'pd' 
import pandas as pd 

# Read data from url '{{include.data_url}}' 
data = pd.read_csv("{{include.data_url}}") 

# Preview the first 5 lines of the loaded data 
data.head()